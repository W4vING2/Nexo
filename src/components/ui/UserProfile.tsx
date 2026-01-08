'use client'

import BackButton from '@/components/ui/BackButton'
import Post from '@/components/ui/Post'
import nexoStore from '@/store/nexoStore'
import type { Post as PostType } from '@/types/post.types'
import type { User as UserType } from '@/types/user.types'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import FriendCard from './FriendCard'

interface Friend {
	id: number
	username: string
	avatarUrl?: string | null
}

interface UserProfileClientProps {
	user: UserType & { id: number }
}

export default function UserProfileClient({ user }: UserProfileClientProps) {
	const { user: currentUser } = nexoStore()

	const [friends, setFriends] = useState<Friend[]>([])
	const [posts, setPosts] = useState<PostType[]>([])
	const [isFriend, setIsFriend] = useState<boolean>(false)
	const [loadingStatus, setLoadingStatus] = useState(true)
	const [requestStatus, setRequestStatus] = useState<
		'idle' | 'pending' | 'sent'
	>('idle')

	// Загружаем друзей пользователя
	useEffect(() => {
		if (!user?.id) return
		fetch(`/api/friends?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setFriends(data.friends ?? []))
			.catch(console.error)
	}, [user?.id])

	// Загружаем посты пользователя
	useEffect(() => {
		if (!user?.id) return
		fetch(`/api/posts?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setPosts(data.posts ?? []))
			.catch(console.error)
	}, [user?.id])

	// Проверяем статус дружбы и заявки
	useEffect(() => {
		if (!currentUser?.id || !user?.id) return

		if (currentUser.id === user.id) {
			setIsFriend(true)
			setRequestStatus('idle')
			setLoadingStatus(false)
			return
		}

		const checkFriend = async () => {
			try {
				const res = await fetch(
					`/api/friends/status?userId=${currentUser.id}&targetId=${user.id}`
				)
				if (!res.ok) throw new Error('Error checking friend status')
				const data = await res.json()
				setIsFriend(Boolean(data.isFriend))
				setRequestStatus(data.hasPendingRequest ? 'sent' : 'idle')
			} catch (e) {
				console.error(e)
				setIsFriend(false)
				setRequestStatus('idle')
			} finally {
				setLoadingStatus(false)
			}
		}

		checkFriend()
	}, [currentUser?.id, user?.id])

	// Отправка заявки
	const sendFriendRequest = async () => {
		if (!currentUser?.id) return
		if (currentUser.id === user.id) return
		if (requestStatus !== 'idle') return

		setRequestStatus('pending')

		try {
			const res = await fetch('/api/friends/request', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fromUserId: currentUser.id,
					toUserId: user.id,
				}),
			})

			if (!res.ok) {
				const err = await res.json()
				console.error(err)
				setRequestStatus('idle')
				return
			}

			setRequestStatus('sent') // Заявка отправлена
		} catch (e) {
			console.error(e)
			setRequestStatus('idle')
		}
	}

	if (!user) {
		return (
			<p className='text-center text-gray-400 mt-20'>Пользователь не найден</p>
		)
	}

	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white'>
			<div className='max-w-xl mx-auto px-4 py-10 flex flex-col items-center gap-4'>
				{/* Аватар */}
				<div className='w-24 h-24 rounded-full bg-gray-700 overflow-hidden'>
					<Image
						src={user.avatarUrl || '/logo.png'}
						alt={user.username || 'avatar'}
						width={96}
						height={96}
						className='w-full h-full object-cover'
					/>
				</div>

				<h1 className='text-xl font-bold'>@{user.username}</h1>

				<div className='flex gap-3'>
					<BackButton />

					{loadingStatus ? (
						<p>Загрузка...</p>
					) : currentUser?.id && currentUser.id !== user.id ? (
						isFriend ? (
							<button
								disabled
								className='px-4 py-2 rounded-xl bg-green-700 text-white'
							>
								✓ Друзья
							</button>
						) : requestStatus === 'sent' ? (
							<button
								disabled
								className='px-4 py-2 rounded-xl bg-gray-500 text-white'
							>
								Заявка отправлена
							</button>
						) : (
							<button
								onClick={sendFriendRequest}
								disabled={requestStatus !== 'idle'}
								className='px-4 py-2 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-full transition disabled:opacity-50'
							>
								Добавить в друзья
							</button>
						)
					) : null}
				</div>
			</div>

			{/* Друзья */}
			<div className='max-w-xl mx-auto px-4 py-4'>
				<h2 className='text-lg font-bold mb-2'>Друзья</h2>
				<div className='flex flex-wrap gap-3'>
					{friends.length === 0 ? (
						<p className='text-gray-400'>У пользователя нет друзей</p>
					) : (
						friends.map(f => <FriendCard key={f.id} friend={f} />)
					)}
				</div>
			</div>

			{/* Посты */}
			<div className='max-w-xl mx-auto px-4 py-4 flex flex-col gap-4'>
				<h2 className='text-lg font-bold mb-2'>Посты пользователя</h2>

				{posts.length === 0 ? (
					<p className='text-gray-400 text-sm'>Постов пока нет</p>
				) : (
					posts.map(post => (
						<Post
							key={post.id}
							id={post.id}
							user={user.username || 'Неизвестный'}
							text={post.content}
							likes={post.likes}
							dislikes={post.dislikes}
							createdAt={post.createdAt.toString()}
						/>
					))
				)}
			</div>
		</div>
	)
}
