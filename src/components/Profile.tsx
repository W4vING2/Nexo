'use client'

import nexoStore from '@/store/nexoStore'
import Image from 'next/image'
import { useState } from 'react'
import ProfileEditModal from './ui/ProfileEdit'

export interface Post {
	id: number
	content: string
	createdAt: Date
}

export default function Profile() {
	const { user, setIsLogged, setUser } = nexoStore()
	const [posts, setPosts] = useState<Post[]>([])
	const [loading, setLoading] = useState(false)

	if (!user) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white px-4'>
				<p className='text-gray-400 text-lg'>Пользователь не найден</p>
			</div>
		)
	}

	const onCreatePost = async (formData: FormData) => {
		const content = formData.get('content')
		if (!content || !user?.id || loading) return
		setLoading(true)
		try {
			const res = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, userId: user.id }),
			})
			if (!res.ok) throw new Error('Ошибка при создании поста')
			const post: Post = await res.json()
			setPosts(prev => [post, ...prev])
		} catch (err) {
			console.error(err)
			alert('Ошибка при создании поста')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white'>
			<div className='relative h-40 bg-gray-800/80 backdrop-blur-md shadow-lg'>
				<div className='absolute -bottom-12 left-4'>
					<Image
						width={600}
						height={600}
						src={user.avatarUrl || '/logo.png'}
						alt='avatar'
						className='w-28 h-28 rounded-full border-4 border-gray-900 object-cover shadow-xl'
						loading='eager'
					/>
				</div>
			</div>

			<div className='pt-16 px-4 max-w-xl mx-auto'>
				<div className='flex justify-between items-start'>
					<div>
						<h1 className='text-2xl font-extrabold'>{user.name}</h1>
						<p className='text-gray-400 text-sm mt-1'>@{user.username}</p>
					</div>
					<ProfileEditModal />
				</div>

				{user.bio && (
					<p className='mt-3 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-xl'>
						{user.bio}
					</p>
				)}

				<form
					className='mt-6 bg-gray-900/70 p-4 rounded-2xl border border-gray-800'
					action={onCreatePost}
				>
					<textarea
						name='content'
						placeholder='Что нового?'
						className='w-full bg-transparent resize-none text-sm text-white placeholder-gray-500 focus:outline-none'
						rows={3}
					/>
					<div className='flex justify-end mt-3'>
						<button type='submit' disabled={loading} className='z-99'>
							{loading ? 'Публикация...' : 'Опубликовать'}
						</button>
					</div>
				</form>

				<div className='mt-6 flex flex-col gap-4'>
					{posts.length === 0 && (
						<p className='text-center text-gray-400'>Пока нет постов</p>
					)}

					{posts.map(post => (
						<div
							key={post.id}
							className='bg-gray-800/60 p-4 rounded-2xl text-sm'
						>
							<p>{post.content}</p>
							<p className='mt-2 text-xs text-gray-500'>
								{new Date(post.createdAt).toLocaleString()}
							</p>
						</div>
					))}
				</div>
			</div>

			<button
				onClick={() => {
					localStorage.removeItem('user')
					setUser(null)
					setIsLogged(false)
				}}
				className='mt-6 w-full rounded-full border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10'
			>
				Выйти из аккаунта
			</button>
		</div>
	)
}
