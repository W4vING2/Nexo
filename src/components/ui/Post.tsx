'use client'

import nexoStore from '@/store/nexoStore'
import { PostProps } from '@/types/post.types'
import { useEffect, useState } from 'react'

export default function Post({
	user,
	text,
	likes = 0,
	dislikes = 0,
	id,
	createdAt,
}: PostProps) {
	const { user: currentUser } = nexoStore()
	const [likeCount, setLikeCount] = useState(likes)
	const [dislikeCount, setDislikeCount] = useState(dislikes)
	const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(
		null
	)

	useEffect(() => {
		if (!id || !currentUser?.id) return

		const fetchReaction = async () => {
			try {
				const res = await fetch(
					`/api/posts/${id}/reaction?userId=${currentUser.id}`
				)
				if (!res.ok) throw new Error('Ошибка получения реакции')
				const data = await res.json()
				setLikeCount(data.likes)
				setDislikeCount(data.dislikes)
				setUserReaction(data.type)
			} catch (err) {
				console.error(err)
			}
		}

		fetchReaction()
	}, [id, currentUser?.id])

	function timeAgo(date: string) {
		const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
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
	}

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
			if (!res.ok) throw new Error(data.error || 'Ошибка реакции')

			setLikeCount(data.likes)
			setDislikeCount(data.dislikes)
			setUserReaction(type)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className='flex p-5 gap-4 border-b border-gray-800 hover:bg-zinc-900 transition w-[95%] mx-auto rounded-xl'>
			<div className='w-12 h-12 rounded-full bg-zinc-700 shrink-0' />
			<div className='flex flex-col gap-2 w-full'>
				<div className='flex items-center justify-between'>
					<h1 className='font-bold text-white text-sm'>{user}</h1>
					<span className='text-gray-500 text-xs'>
						• {timeAgo(createdAt as string)}
					</span>
				</div>
				<p className='text-gray-200 text-sm leading-relaxed'>{text}</p>
				<div className='flex gap-4 mt-2'>
					<button
						onClick={() => react('like')}
						className={`text-sm px-2 py-1 rounded hover:bg-gray-700 transition ${
							userReaction === 'like'
								? 'bg-blue-600 text-white'
								: 'text-gray-400'
						}`}
					>
						👍 {likeCount}
					</button>
					<button
						onClick={() => react('dislike')}
						className={`text-sm px-2 py-1 rounded hover:bg-gray-700 transition ${
							userReaction === 'dislike'
								? 'bg-red-600 text-white'
								: 'text-gray-400'
						}`}
					>
						👎 {dislikeCount}
					</button>
				</div>
			</div>
		</div>
	)
}
