'use client'

import nexoStore from '@/store/nexoStore'
import { PostProps } from '@/types/post.types'
import { Heart, MessageCircle, ThumbsDown, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { memo, useEffect, useMemo, useState } from 'react'

interface PostComponentProps extends PostProps {
	avatar?: string
	onDelete?: (postId: number) => void
}

function Post({
	id,
	authorId,
	user,
	text,
	avatar,
	createdAt,
	onDelete,
}: PostComponentProps) {
	const { user: currentUser } = nexoStore()
	const router = useRouter()

	const [likeCount, setLikeCount] = useState(0)
	const [dislikeCount, setDislikeCount] = useState(0)
	const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
		null
	)
	const [commentsCount, setCommentsCount] = useState(0)

	// Fetch stats
	useEffect(() => {
		if (!id || !currentUser?.id) return

		const fetchStats = async () => {
			try {
				const res = await fetch(
					`/api/posts/${id}/stats?userId=${currentUser.id}`
				)
				if (!res.ok) throw new Error('Failed to fetch stats')
				const data = await res.json()
				setLikeCount(data.likes)
				setDislikeCount(data.dislikes)
				setUserReaction(data.type)
				setCommentsCount(data.commentsCount)
			} catch (err) {
				console.error(err)
			}
		}

		fetchStats()
	}, [id, currentUser?.id])

	const formattedTime = useMemo(() => {
		if (!createdAt) return 'now'
		const seconds = Math.floor(
			(Date.now() - new Date(createdAt).getTime()) / 1000
		)
		const intervals = [
			{ label: 'y', seconds: 31536000 },
			{ label: 'mo', seconds: 2592000 },
			{ label: 'd', seconds: 86400 },
			{ label: 'h', seconds: 3600 },
			{ label: 'm', seconds: 60 },
		]
		for (const i of intervals) {
			const count = Math.floor(seconds / i.seconds)
			if (count >= 1) return `${count}${i.label}`
		}
		return 'now'
	}, [createdAt])

	const react = async (type: 'like' | 'dislike') => {
		if (!id || !currentUser?.id) return
		if (userReaction === type) return

		try {
			const res = await fetch(`/api/posts/${id}/react`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'x-user-id': currentUser.id.toString(),
				},
				body: JSON.stringify({ type }),
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || 'Reaction failed')

			setLikeCount(data.likes)
			setDislikeCount(data.dislikes)
			setUserReaction(type)
		} catch (err) {
			console.error(err)
		}
	}

	const handleDelete = async () => {
		if (!id) return

		try {
			const res = await fetch(`/api/posts/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'x-user-id': currentUser?.id?.toString() ?? '',
				},
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || 'Delete failed')

			onDelete?.(id) // remove post locally
		} catch (err) {
			console.error(err)
			alert('Не удалось удалить пост')
		}
	}

	const goToPostPage = () => router.push(`/post/${id}`)

	return (
		<div className='flex gap-3 px-4 py-3 hover:bg-gray-950 transition-colors rounded-xl w-full border border-white/20'>
			<Image
				src={avatar || '/logo.png'}
				alt={user || 'Неизвестный'}
				width={48}
				height={48}
				className='w-12 h-12 rounded-full object-cover border-2 border-gray-500'
			/>

			<div className='flex-1 flex flex-col gap-1'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-1'>
						<h1 className='font-semibold text-white text-sm'>
							{user || 'Неизвестный'}
						</h1>
						<span className='text-gray-500 text-sm'>
							@{user?.toLowerCase()}
						</span>
					</div>
					<span className='text-gray-500 text-xs'>{formattedTime}</span>
				</div>

				<p className='text-gray-200 text-sm leading-snug'>{text}</p>

				<div className='flex justify-between items-center mt-2 w-[65%] text-sm text-gray-400'>
					<button
						onClick={() => react('like')}
						className='flex items-center gap-1'
					>
						<Heart
							className={`w-4 h-4 transition ${
								userReaction === 'like'
									? 'stroke-red-500 fill-red-500'
									: 'stroke-gray-400 fill-black'
							}`}
						/>
						{likeCount}
					</button>

					<button
						onClick={() => react('dislike')}
						className='flex items-center gap-1'
					>
						<ThumbsDown
							className={`w-4 h-4 transition ${
								userReaction === 'dislike'
									? 'stroke-blue-500 fill-blue-500'
									: 'stroke-gray-400 fill-black'
							}`}
						/>
						{dislikeCount}
					</button>

					<button onClick={goToPostPage} className='flex items-center gap-1'>
						<MessageCircle className='w-4 h-4 stroke-gray-400 fill-black' />
						{commentsCount}
					</button>

					{Number(currentUser?.id) === Number(authorId) && (
						<button onClick={handleDelete} className='flex items-center gap-1'>
							<Trash className='w-4 h-4 stroke-gray-400 fill-black z-90' />
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default memo(Post)
