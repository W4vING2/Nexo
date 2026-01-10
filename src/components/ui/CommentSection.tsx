'use client'

import nexoStore from '@/store/nexoStore'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface Comment {
	id: number
	postId: number
	userId: number
	username: string
	avatarUrl?: string | null
	text: string
	createdAt: string
}

interface CommentSectionProps {
	postId: number
}

export default function CommentSection({ postId }: CommentSectionProps) {
	// Подписка на Zustand
	const user = nexoStore(state => state.user)

	const [comments, setComments] = useState<Comment[]>([])
	const [input, setInput] = useState('')
	const bottomRef = useRef<HTMLDivElement>(null)

	// Загрузка комментариев
	useEffect(() => {
		const fetchComments = async () => {
			try {
				const res = await fetch(`/api/posts/${postId}/comments`)
				if (!res.ok) return
				const data: Comment[] = await res.json()
				setComments(data)
			} catch (err) {
				console.error(err)
			}
		}

		fetchComments()
	}, [postId])

	// Отправка нового комментария
	const sendComment = async () => {
		if (!input.trim() || !user?.id) {
			console.error('Невозможно отправить комментарий: отсутствует userId')
			return
		}

		const username = user.username
		const avatarUrl = user.avatarUrl ?? '/logo.png'

		try {
			const res = await fetch(`/api/posts/${postId}/comments`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: user.id,
					username,
					avatarUrl,
					text: input,
				}),
			})

			const data: Comment = await res.json()

			if (!res.ok) {
				console.error('Ошибка при добавлении комментария:', data)
				return
			}

			setComments(prev => [...prev, data])
			setInput('')
			bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
		} catch (err) {
			console.error('Ошибка при добавлении комментария:', err)
		}
	}

	return (
		<div className='flex flex-col gap-2 mt-4'>
			<div className='flex flex-col gap-2 max-h-64 overflow-y-auto'>
				{comments.map(c => (
					<div key={c.id} className='flex gap-2 items-start'>
						<div className='w-8 h-8 rounded-full overflow-hidden'>
							<Image
								src={c.avatarUrl || '/logo.png'}
								width={32}
								height={32}
								alt={c.username}
								className='w-full h-full object-cover'
							/>
						</div>
						<div className='bg-gray-800 p-2 rounded-xl flex flex-col'>
							<span className='text-sm text-gray-300 font-medium'>
								@{c.username}
							</span>
							<p className='text-sm text-white'>{c.text}</p>
						</div>
					</div>
				))}
				<div ref={bottomRef} />
			</div>

			<div className='flex mt-2 gap-2'>
				<input
					type='text'
					value={input}
					onChange={e => setInput(e.target.value)}
					placeholder='Написать комментарий...'
					className='flex-1 rounded-full px-4 py-2 bg-gray-900 text-white outline-none'
					onKeyDown={e => e.key === 'Enter' && sendComment()}
				/>
				<button
					onClick={sendComment}
					className='bg-blue-600 px-4 py-2 rounded-full text-white'
				>
					➤
				</button>
			</div>
		</div>
	)
}
