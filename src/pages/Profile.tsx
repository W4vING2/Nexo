'use client'

import Post from '@/components/Post'
import nexoStore from '@/store/nexoStore'
import type { Friend, FriendRequest } from '@/types/friend.types'
import type { PostType } from '@/types/post.types'
import { getByUserId } from '@/utils/friend/getByUserId'
import { getRequests } from '@/utils/friend/getRequest'
import { handleRequest } from '@/utils/friend/handleRequest'
import { create } from '@/utils/post/create'
import { getPostsByUserId } from '@/utils/post/getByUserId'
import { getUserByEmail } from '@/utils/user/getUserByEmail'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import FriendCard from '../components/FriendCard'
import ProfileEditModal from '../components/ProfileEdit'

export default function Profile() {
	const { user, setIsLogged, setUser } = nexoStore()
	const [posts, setPosts] = useState<PostType[]>([])
	const [friends, setFriends] = useState<Friend[]>([])
	const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
	const [content, setContent] = useState('')
	const [loading, setLoading] = useState(false)

	const handlePostDelete = (postId: number) => {
		setPosts(prev => prev.filter(post => post.id !== postId))
	}

	const getAvatarSrc = (src?: string | null) =>
		src && src.trim() !== '' ? src : '/logo.png'

	useEffect(() => {
		if (!user?.email) return
		const fetchUser = async () => {
			const userData = await getUserByEmail(user.email)
			if (userData) {
				setUser({
					...user,
					name: userData.name as string,
					bio: userData.bio,
					avatarUrl: userData.avatarUrl,
				})
			}
		}
		fetchUser()
	}, [user?.email, user?.email, user?.username])

	useEffect(() => {
		if (!user?.id) return

		const fetchData = async () => {
			const postsData = await getPostsByUserId(user.id)
			const formattedPosts: PostType[] = postsData.map(post => ({
				id: post.id,
				content: post.content,
				authorId: user.id,
				createdAt: post.createdAt.toISOString(),
				likes: 0,
				dislikes: 0,
				author: {
					id: user.id,
					username: user.username || 'Неизвестный',
					avatarUrl: user.avatarUrl || null,
				},
			}))
			setPosts(formattedPosts)

			const friendsData = await getByUserId(user.id)
			setFriends(friendsData)

			const requestsData = await getRequests(String(user.id))
			setFriendRequests(requestsData)
		}

		fetchData()
	}, [user])

	const onCreatePost = useCallback(async () => {
		if (!content.trim() || !user?.id || loading) return
		setLoading(true)
		const newPost = await create({ content, userId: user.id })
		const postWithType: PostType = {
			id: newPost.id,
			authorId: user.id,
			content: newPost.content,
			createdAt: newPost.createdAt.toISOString(),
			likes: 0,
			dislikes: 0,
			author: {
				id: user.id,
				username: user.username || 'Неизвестный',
				avatarUrl: user.avatarUrl || null,
			},
		}
		setPosts(prev => [postWithType, ...prev])
		setContent('')
		setLoading(false)
	}, [content, loading, user])

	const handleFriendRequest = useCallback(
		async (requestId: number, accept: boolean) => {
			await handleRequest(requestId, accept)

			setFriendRequests(prev => prev.filter(r => r.id !== requestId))

			if (accept) {
				const friendsData = await getByUserId(user?.id || 0)
				setFriends(friendsData)
			}
		},
		[user?.id]
	)

	const renderedPosts = useMemo(() => {
		return posts.map(post => (
			<Post
				key={post.id}
				id={post.id}
				authorId={user?.id ?? 0}
				user={user?.username ?? 'Неизвестный'}
				avatar={getAvatarSrc(user?.avatarUrl)}
				text={post.content}
				likes={post.likes}
				dislikes={post.dislikes}
				createdAt={post.createdAt.toString()}
				onDelete={handlePostDelete}
			/>
		))
	}, [posts, user?.username, user?.avatarUrl, user?.id])

	const renderedFriends = useMemo(() => {
		return friends.map(f => <FriendCard key={f.id} friend={f} />)
	}, [friends])

	const renderedFriendRequests = useMemo(() => {
		return friendRequests.map(req => (
			<div
				key={req.id}
				className='flex items-center justify-between bg-gray-900 p-2 rounded-xl'
			>
				<div className='flex items-center gap-2'>
					<Image
						src={getAvatarSrc(req.fromUser.avatarUrl)}
						width={32}
						height={32}
						alt={req.fromUser.username}
						className='rounded-full object-cover'
					/>
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
		))
	}, [friendRequests, handleFriendRequest])

	if (!user) {
		return (
			<p className='text-center text-gray-400 min-h-screen flex items-center justify-center'>
				Нет пользователя
			</p>
		)
	}

	return (
		<div className='flex flex-col h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white pt-14 pb-14'>
			<div className='flex-1 overflow-y-auto px-4 pt-4 pb-4'>
				<div className='w-28 h-28 rounded-full border-4 border-black overflow-hidden mb-4'>
					<Image
						src={getAvatarSrc(user.avatarUrl)}
						alt='avatar'
						width={112}
						height={112}
						className='w-full h-full object-cover'
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
					<div className='flex flex-wrap gap-3 mb-4'>
						{friends.length ? (
							renderedFriends
						) : (
							<p className='text-gray-400'>Нет друзей</p>
						)}
					</div>

					{friendRequests.length > 0 && (
						<div className='bg-gray-800 p-3 rounded-xl mb-4'>
							<h3 className='font-medium mb-2'>Заявки в друзья</h3>
							<div className='flex flex-col gap-2'>
								{renderedFriendRequests}
							</div>
						</div>
					)}
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
					{posts.length ? (
						renderedPosts
					) : (
						<p className='text-center text-gray-400'>Пока нет постов</p>
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
