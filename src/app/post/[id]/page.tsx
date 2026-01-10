'use client'

import CommentSection from '@/components/ui/CommentSection'
import PostComponent from '@/components/ui/Post'
import { PostProps } from '@/types/post.types'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PostPage() {
	const { id } = useParams()
	const postId = Number(id)
	const router = useRouter()

	const [post, setPost] = useState<PostProps | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!postId) return

		const fetchPost = async () => {
			const res = await fetch(`/api/posts/${postId}`)
			if (!res.ok) return
			const data: PostProps = await res.json()
			setPost(data)
			setLoading(false)
		}

		fetchPost()
	}, [postId])

	if (loading) return <p className='text-white p-4'>Загрузка...</p>
	if (!post) return <p className='text-white p-4'>Пост не найден</p>

	return (
		<div className='min-h-screen bg-black text-white p-4 pt-14'>
			{/* Кнопка "Назад" */}
			<button
				onClick={() => router.push('/')}
				className='mb-4 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors'
			>
				Назад
			</button>

			<PostComponent {...post} avatar={post.avatar ?? undefined} />
			<CommentSection postId={post.id} />
		</div>
	)
}
