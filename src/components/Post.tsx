'use client'

import nexoStore from '@/store/nexoStore'
import { deletePost } from '@/utils/post/delete'
import { getStats } from '@/utils/post/getStats'
import { toggleReaction } from '@/utils/post/toggleReaction'
import { Heart, MessageCircle, ThumbsDown, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import CommentSection from './CommentSection'

interface PostProps {
	id: number
	authorId: number
	user: string
	avatar?: string
	text: string
	likes: number
	dislikes: number
	createdAt: string
	onDelete: (postId: number) => void
	image?: string | null
}

export default function Post({
	id,
	authorId,
	user,
	avatar,
	text,
	likes: initialLikes,
	dislikes: initialDislikes,
	createdAt,
	onDelete,
	image,
}: PostProps) {
	const { user: currentUser } = nexoStore()
	const [likes, setLikes] = useState(initialLikes)
	const [dislikes, setDislikes] = useState(initialDislikes)
	const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null)
	const [commentsCount, setCommentsCount] = useState(0)
	const [showComments, setShowComments] = useState(false)

	useEffect(() => {
		const fetchStats = async () => {
			const stats = await getStats(id, currentUser?.id)
			setLikes(stats.likes)
			setDislikes(stats.dislikes)
			setCommentsCount(stats.commentsCount)
			const safeType =
				stats.type === 'like' || stats.type === 'dislike' ? stats.type : null

			setReaction(safeType)
		}

		fetchStats()
	}, [id, currentUser?.id])

	const handleLike = async () => {
		if (!currentUser?.id) return

		if (reaction === 'like') {
			setLikes(likes - 1)
			setReaction(null)
		} else {
			if (reaction === 'dislike') setDislikes(dislikes - 1)
			setLikes(likes + 1)
			setReaction('like')
		}

		const result = await toggleReaction(id, currentUser.id, 'like')
		setLikes(result.likes)
		setDislikes(result.dislikes)
	}

	const handleDislike = async () => {
		if (!currentUser?.id) return

		if (reaction === 'dislike') {
			setDislikes(dislikes - 1)
			setReaction(null)
		} else {
			if (reaction === 'like') setLikes(likes - 1)
			setDislikes(dislikes + 1)
			setReaction('dislike')
		}

		const result = await toggleReaction(id, currentUser.id, 'dislike')
		setLikes(result.likes)
		setDislikes(result.dislikes)
	}

	const handleDelete = async () => {
		if (!currentUser?.id || !currentUser?.email) return

		await deletePost(id, currentUser.id, currentUser.email)
		onDelete(id)
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		})
	}

	return (
		<article className='bg-gray-900 rounded-2xl p-4'>
			<div className='flex items-start gap-3'>
				<Image
					src={avatar || '/logo.png'}
					alt={`@${user}`}
					width={40}
					height={40}
					className='rounded-full'
				/>
				<div className='flex-1'>
					<div className='flex items-center gap-2 mb-1'>
						<h3 className='font-bold'>@{user}</h3>
						<span className='text-gray-500 text-sm'>
							{formatDate(createdAt)}
						</span>
					</div>
					<p className='mb-3'>{text}</p>
					{image && (
						<div className='mb-3 rounded-xl overflow-hidden max-h-96'>
							<Image
								src={image}
								alt='Post image'
								width={500}
								height={500}
								className='w-full object-contain'
							/>
						</div>
					)}
					<div className='flex items-center gap-4'>
						<button
							onClick={handleLike}
							className={`flex items-center gap-1 ${
								reaction === 'like' ? 'text-red-500' : 'text-gray-500'
							}`}
						>
							<Heart
								size={18}
								fill={reaction === 'like' ? 'currentColor' : 'none'}
							/>
							<span>{likes}</span>
						</button>
						<button
							onClick={handleDislike}
							className={`flex items-center gap-1 ${
								reaction === 'dislike' ? 'text-blue-500' : 'text-gray-500'
							}`}
						>
							<ThumbsDown
								size={18}
								fill={reaction === 'dislike' ? 'currentColor' : 'none'}
							/>
							<span>{dislikes}</span>
						</button>
						<button
							onClick={() => setShowComments(!showComments)}
							className='flex items-center gap-1 text-gray-500'
						>
							<MessageCircle size={18} />
							<span>{commentsCount}</span>
						</button>
						{currentUser?.id === authorId && (
							<button
								onClick={handleDelete}
								className='ml-auto text-gray-500 hover:text-red-500'
							>
								<Trash2 size={18} />
							</button>
						)}
					</div>
					{showComments && <CommentSection postId={id} />}
				</div>
			</div>
		</article>
	)
}
