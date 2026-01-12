'use client'

import nexoStore from '@/store/nexoStore'
import { create } from '@/utils/comment/create'
import { deleteComment } from '@/utils/comment/delete'
import { get } from '@/utils/comment/get'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'

export interface CommentWithUserData {
	id: number
	postId: number
	userId: number
	username: string
	avatarUrl: string
	text: string
	createdAt: string
}

export default function CommentSection({ postId }: { postId: number }) {
	const { user } = nexoStore()
	const [comments, setComments] = useState<CommentWithUserData[]>([])
	const [newComment, setNewComment] = useState('')

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const data = await get(postId)
				setComments(data)
			} catch (error) {
				console.error('Failed to load comments:', error)
			}
		}

		fetchComments()
	}, [postId])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!newComment.trim() || !user?.id) return

		try {
			const comment = await create(postId, user.id, newComment)
			setComments([...comments, comment])
			setNewComment('')
		} catch (error) {
			console.error('Failed to create comment:', error)
		}
	}

	const handleDelete = async (e: FormEvent, comment: CommentWithUserData) => {
		e.preventDefault()

		try {
			await deleteComment(comment.id, user?.id)
			setComments(comments.filter(c => c.id !== comment.id))
		} catch (error) {
			console.error('Error deleting comment:', error)
		}
	}

	return (
		<div className='mt-4 space-y-4'>
			{/* Comment form */}
			<form onSubmit={handleSubmit} className='flex gap-2'>
				<input
					type='text'
					value={newComment}
					onChange={e => setNewComment(e.target.value)}
					placeholder='Написать комментарий...'
					className='flex-1 px-3 py-2 bg-gray-800 rounded-full text-sm'
				/>
				<button
					type='submit'
					className='px-4 py-2 bg-blue-600 rounded-full text-sm'
				>
					Отправить
				</button>
			</form>

			{/* Comments list */}
			<div className='space-y-3'>
				{comments.map(comment => (
					<div key={comment.id} className='flex gap-3'>
						<Image
							src={comment.avatarUrl}
							alt={comment.username}
							width={32}
							height={32}
							className='rounded-full'
						/>
						<div className='flex-1'>
							<div className='flex items-center gap-2'>
								<span className='font-medium text-sm'>@{comment.username}</span>
								<span className='text-xs text-gray-500'>
									{new Date(comment.createdAt).toLocaleDateString()}
								</span>
							</div>
							<p className='text-sm'>{comment.text}</p>
						</div>
						{user?.id === comment.userId && (
							<button
								onClick={e => handleDelete(e, comment)}
								className='text-red-500 hover:text-red-400'
							>
								Удалить
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
