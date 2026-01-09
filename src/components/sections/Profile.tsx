'use client'

import Post from '@/components/ui/Post'
import nexoStore from '@/store/nexoStore'
import type { Post as PostType } from '@/types/post.types'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import FriendCard from '../ui/FriendCard'
import ProfileEditModal from '../ui/ProfileEdit'

interface Friend {
	id: number
	username: string
	avatarUrl?: string
}

interface FriendRequest {
	id: number
	fromUser: {
		id: number
		username: string
		avatarUrl?: string
	}
}

export default function Profile() {
	const { user, setIsLogged, setUser } = nexoStore()
	const [posts, setPosts] = useState<PostType[]>([])
	const [friends, setFriends] = useState<Friend[]>([])
	const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
	const [content, setContent] = useState('')
	const [loading, setLoading] = useState(false)

	// ✅ Загрузка пользователя
	useEffect(() => {
		if (!user?.email) return

		const fetchUser = async () => {
			try {
				const res = await fetch(
					`/api/user/get?email=${encodeURIComponent(user.email)}`
				)
				const data = await res.json()
				if (!data.error) {
					setUser({
						...user,
						name: data.name,
						bio: data.bio,
						avatarUrl: data.avatarUrl,
					})
				}
			} catch (err) {
				console.error(err)
			}
		}

		fetchUser()
	}, [user?.email])

	// ✅ Загрузка постов, друзей и заявок
	useEffect(() => {
		if (!user?.id) return

		fetch(`/api/posts?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setPosts(data.posts ?? []))
			.catch(console.error)

		fetch(`/api/friends?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setFriends(data.friends ?? []))
			.catch(console.error)

		fetch(`/api/friends/request?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setFriendRequests(data.requests ?? []))
			.catch(console.error)
	}, [user?.id])

	// ✅ Создание поста
	const onCreatePost = useCallback(async () => {
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
	}, [content, loading, user?.id])

	// ✅ Обработка заявок в друзья
	const handleFriendRequest = useCallback(
		async (requestId: number, accept: boolean) => {
			try {
				const res = await fetch(`/api/friends/request/${requestId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ accept }),
				})
				if (!res.ok) {
					const error = await res.json()
					console.error('Friend request error:', error)
					return
				}
				setFriendRequests(prev => prev.filter(r => r.id !== requestId))
				if (accept) {
					fetch(`/api/friends?userId=${user?.id}`)
						.then(res => res.json())
						.then(data => setFriends(data.friends ?? []))
				}
			} catch (err) {
				console.error(err)
			}
		},
		[user?.id]
	)

	// ✅ Мемоизация постов
	const renderedPosts = useMemo(() => {
		return posts.map(post => (
			<Post
				key={post.id}
				id={post.id}
				user={user?.username ?? 'Неизвестный пользователь'}
				text={post.content}
				likes={post.likes}
				dislikes={post.dislikes}
				createdAt={post.createdAt.toString()}
			/>
		))
	}, [posts, user?.username])

	// ✅ Мемоизация друзей
	const renderedFriends = useMemo(() => {
		return friends.length ? (
			friends.map(f => <FriendCard key={f.id} friend={f} />)
		) : (
			<p className='text-gray-400'>Нет друзей</p>
		)
	}, [friends])

	// ✅ Мемоизация заявок
	const renderedFriendRequests = useMemo(() => {
		return friendRequests.length ? (
			<div className='bg-gray-800 p-3 rounded-xl mb-4'>
				<h3 className='font-medium mb-2'>Заявки в друзья</h3>
				<div className='flex flex-col gap-2'>
					{friendRequests.map(req => (
						<div
							key={req.id}
							className='flex items-center justify-between bg-gray-900 p-2 rounded-xl'
						>
							<div className='flex items-center gap-2'>
								{req.fromUser.avatarUrl && (
									<Image
										src={req.fromUser.avatarUrl}
										width={32}
										height={32}
										alt={req.fromUser.username}
										className='rounded-full object-cover'
									/>
								)}
								<p className='text-sm'>@{req.fromUser.username}</p>
							</div>
							<div className='flex gap-2'>
								<button
									onClick={() => handleFriendRequest(req.id, true)}
									className='px-2 py-1 bg-blue-600 rounded-full text-xs'
								>
									Принять
								</button>
								<button
									onClick={() => handleFriendRequest(req.id, false)}
									className='px-2 py-1 bg-red-600 rounded-full text-xs'
								>
									Отклонить
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		) : null
	}, [friendRequests, handleFriendRequest])

	if (!user)
		return (
			<p className='text-center text-gray-400 min-h-screen flex items-center justify-center'>
				Нет пользователя
			</p>
		)

	return (
		<div className='flex flex-col h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white pt-14 pb-14'>
			<div className='flex-1 overflow-y-auto px-4 pt-4 pb-4'>
				<div className='w-28 h-28 rounded-full border-4 border-black overflow-hidden mb-4'>
					<Image
						src={user.avatarUrl || '/logo.png'}
						alt='avatar'
						width={112}
						height={112}
						className='w-full h-full object-contain'
					/>
				</div>

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

				<div className='mt-6'>
					<h2 className='text-lg font-bold mb-2'>Друзья</h2>
					<div className='flex flex-wrap gap-3 mb-4'>{renderedFriends}</div>
					{renderedFriendRequests}
				</div>

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
						renderedPosts
					)}
				</div>

				<div className='mt-6 mb-6'>
					<button
						onClick={() => {
							localStorage.removeItem('user')
							setUser(null)
							setIsLogged(false)
						}}
						className='w-full border border-red-500 text-red-400 rounded-full py-2'
					>
						Выйти
					</button>
				</div>
			</div>
		</div>
	)
}
