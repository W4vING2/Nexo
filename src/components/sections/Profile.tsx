'use client'

import Post from '@/components/ui/Post'
import nexoStore from '@/store/nexoStore'
import type { Post as PostType } from '@/types/post.types'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ProfileEditModal from '../ui/ProfileEdit'

export default function Profile() {
	const { user, setIsLogged, setUser } = nexoStore()
	const [posts, setPosts] = useState<PostType[]>([])
	const [content, setContent] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!user?.id) return
		fetch(`/api/posts?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setPosts(data.posts ?? []))
			.catch(console.error)
	}, [user?.id])

	const onCreatePost = async () => {
		if (!content.trim() || !user?.id || loading) return
		setLoading(true)
		try {
			const res = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, userId: user.id }),
			})
			const post: PostType = await res.json()
			setPosts(prev => [post, ...prev])
			setContent('')
		} finally {
			setLoading(false)
		}
	}

	if (!user)
		return (
			<p className='text-center text-gray-400 min-h-screen flex items-center justify-center'>
				Нет пользователя
			</p>
		)

	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white'>
			<div className='relative h-40 bg-gray-800'>
				<div className='absolute -bottom-12 left-4'>
					<Image
						src={user.avatarUrl || '/logo.png'}
						alt='avatar'
						width={200}
						height={200}
						className='w-28 h-28 rounded-full border-4 border-black object-cover'
					/>
				</div>
			</div>

			<div className='pt-16 px-4 max-w-xl mx-auto'>
				<div className='flex justify-between items-start'>
					<div>
						<h1 className='text-2xl font-bold'>{user.name}</h1>
						<p className='text-gray-400'>@{user.username}</p>
					</div>
					<ProfileEditModal />
				</div>

				{user.bio && (
					<p className='mt-3 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-xl'>
						{user.bio}
					</p>
				)}

				<div className='mt-6 bg-gray-900 p-4 rounded-xl'>
					<textarea
						value={content}
						onChange={e => setContent(e.target.value)}
						placeholder='Что нового?'
						className='w-full bg-transparent resize-none outline-none text-white placeholder-gray-500'
						rows={3}
					/>
					<div className='flex justify-end mt-3'>
						<button
							onClick={onCreatePost}
							disabled={loading}
							className='px-4 py-2 bg-blue-600 rounded-full text-sm disabled:opacity-50'
						>
							{loading ? 'Публикация...' : 'Опубликовать'}
						</button>
					</div>
				</div>

				<div className='mt-6 flex flex-col gap-4'>
					{posts.length === 0 ? (
						<p className='text-center text-gray-400'>Пока нет постов</p>
					) : (
						posts.map(post => (
							<Post
								key={post.id}
								id={post.id}
								user={user.username!}
								text={post.content}
								likes={post.likes}
								dislikes={post.dislikes}
								createdAt={post.createdAt.toString()}
							/>
						))
					)}
				</div>

				<button
					onClick={() => {
						localStorage.removeItem('user')
						setUser(null)
						setIsLogged(false)
					}}
					className='mt-6 w-full border border-red-500 text-red-400 rounded-full py-2'
				>
					Выйти
				</button>
			</div>
		</div>
	)
}
