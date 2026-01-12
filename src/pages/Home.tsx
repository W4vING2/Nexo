'use client'

import Post from '@/components/Post'
import type { PostType } from '@/types/post.types'
import { getAll } from '@/utils/post/getAll'
import { useEffect, useState } from 'react'

export default function Home() {
	const [posts, setPosts] = useState<PostType[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const data = await getAll()
				setPosts(data)
			} catch (err) {
				console.error('Failed to load posts', err)
				setPosts([])
			} finally {
				setLoading(false)
			}
		}
		loadPosts()
	}, [])

	const handleDelete = (deletedId: number) => {
		setPosts(prev => prev.filter(post => post.id !== deletedId))
	}

	if (loading) {
		return (
			<main className='min-h-screen flex items-center justify-center text-gray-400'>
				Загрузка...
			</main>
		)
	}

	return (
		<main className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white flex flex-col gap-4 px-4 pt-20 pb-14'>
			{posts.length > 0 ? (
				posts.map(post => (
					<Post
						key={post.id}
						id={post.id}
						authorId={post.author.id}
						avatar={post.author.avatarUrl || undefined}
						text={post.content}
						user={post.author.username || 'Неизвестный пользователь'}
						likes={post.likes}
						dislikes={post.dislikes}
						createdAt={post.createdAt}
						onDelete={handleDelete}
					/>
				))
			) : (
				<p className='text-center text-gray-400'>Постов пока нет</p>
			)}
		</main>
	)
}
