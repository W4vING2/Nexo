'use client'

import Post from '@/components/ui/Post'
import { useEffect, useMemo, useState } from 'react'

interface PostType {
	id: number
	content: string
	createdAt: string
	likes: number
	dislikes: number
	author: {
		id: number
		username: string | null
		avatarUrl: string | null
	}
}

export default function Home() {
	const [posts, setPosts] = useState<PostType[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const res = await fetch('/api/posts/all')
				const data = await res.json()
				setPosts(data.posts ?? [])
			} catch (err) {
				console.error('Failed to load posts', err)
				setPosts([])
			} finally {
				setLoading(false)
			}
		}
		loadPosts()
	}, [])

	const renderedPosts = useMemo(() => {
		return posts.map(post => (
			<Post
				key={post.id}
				id={post.id}
				avatar={post.author.avatarUrl || undefined}
				text={post.content}
				user={post.author.username || 'Неизвестный пользователь'}
				likes={post.likes}
				dislikes={post.dislikes}
				createdAt={post.createdAt}
			/>
		))
	}, [posts])

	if (loading) {
		return (
			<main className='min-h-screen flex items-center justify-center text-gray-400'>
				Загрузка...
			</main>
		)
	}

	return (
		<main className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white flex flex-col gap-4 py-4 px-4 pt-14 pb-14'>
			{posts.length > 0 ? (
				renderedPosts
			) : (
				<p className='text-center text-gray-400'>Постов пока нет</p>
			)}
		</main>
	)
}
