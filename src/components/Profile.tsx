'use client'

import nexoStore from '@/store/nexoStore'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ProfileEditModal from './ui/ProfileEdit'

interface ProfilePost {
	id: number
	content: string
	createdAt: Date
	likes: number
	dislikes: number
}

export default function Profile() {
	const { user, setIsLogged, setUser } = nexoStore()

	const [posts, setPosts] = useState<ProfilePost[]>([])
	const [content, setContent] = useState('')
	const [loading, setLoading] = useState(false)

	/* -------- загрузка постов -------- */
	useEffect(() => {
		if (!user?.id) return

		fetch(`/api/posts?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setPosts(data.posts))
			.catch(console.error)
	}, [user?.id])

	/* -------- создание поста -------- */
	const onCreatePost = async () => {
		if (!content.trim() || !user?.id || loading) return
		setLoading(true)

		try {
			const res = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content, userId: user.id }),
			})

			const post = await res.json()
			setPosts(prev => [post, ...prev])
			setContent('')
		} finally {
			setLoading(false)
		}
	}

	/* -------- удаление -------- */
	const onDeletePost = async (id: number) => {
		if (!confirm('Удалить пост?')) return

		await fetch(`/api/posts/${id}`, { method: 'DELETE' })
		setPosts(prev => prev.filter(p => p.id !== id))
	}

	/* -------- лайк / дизлайк -------- */
	const react = async (id: number, type: 'like' | 'dislike') => {
		const res = await fetch(`/api/posts/${id}/${type}`, { method: 'PATCH' })
		const data = await res.json()

		setPosts(prev =>
			prev.map(p =>
				p.id === id
					? {
							...p,
							likes: data.likes,
							dislikes: data.dislikes,
					  }
					: p
			)
		)
	}

	if (!user)
		return <p className='text-center text-gray-400'>Нет пользователя</p>

	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white'>
			{/* ---------- header ---------- */}
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
				<div className='flex justify-between'>
					<div>
						<h1 className='text-2xl font-bold'>{user.name}</h1>
						<p className='text-gray-400'>@{user.username}</p>
					</div>
					<ProfileEditModal />
				</div>

				{/* ---------- create ---------- */}
				<div className='mt-6 bg-gray-900 p-4 rounded-xl'>
					<textarea
						value={content}
						onChange={e => setContent(e.target.value)}
						placeholder='Что нового?'
						className='w-full bg-transparent resize-none outline-none'
						rows={3}
					/>
					<button
						onClick={onCreatePost}
						disabled={loading}
						className='mt-3 px-4 py-2 bg-blue-600 rounded-full text-sm'
					>
						Опубликовать
					</button>
				</div>

				{/* ---------- posts ---------- */}
				<div className='mt-6 space-y-4'>
					{posts.map(post => (
						<div key={post.id} className='bg-gray-800 p-4 rounded-xl'>
							<button
								onClick={() => onDeletePost(post.id)}
								className='float-right text-red-400 text-xs'
							>
								Удалить
							</button>

							<p>{post.content}</p>

							<div className='flex gap-4 mt-3'>
								<button
									onClick={() => react(post.id, 'like')}
									className='text-gray-400 hover:text-blue-400'
								>
									👍 {post.likes}
								</button>
								<button
									onClick={() => react(post.id, 'dislike')}
									className='text-gray-400 hover:text-red-400'
								>
									👎 {post.dislikes}
								</button>
							</div>

							<p className='mt-2 text-xs text-gray-500'>
								{new Date(post.createdAt).toLocaleString()}
							</p>
						</div>
					))}
				</div>

				{/* ---------- logout ---------- */}
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
