'use client'

import nexoStore from '@/store/nexoStore'
import { useEffect, useState } from 'react'
import ChatList from '../chat/ChatList'
import ChatWindow from '../chat/ChatWindow'

interface Friend {
	id: number
	username: string
	avatarUrl?: string
}

interface Chat {
	id: number
	userIds: number[]
	title: string
	users: { userId: number; user: { id: number; username: string } }[]
}

export default function MobileChat() {
	const { user } = nexoStore()
	const [friends, setFriends] = useState<Friend[]>([])
	const [chats, setChats] = useState<Chat[]>([])
	const [activeChatId, setActiveChatId] = useState<number | null>(null)

	const activeChat = chats.find(c => c.id === activeChatId) || null

	// Загружаем друзей
	useEffect(() => {
		if (!user?.id) return
		fetch(`/api/friends?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setFriends(data.friends ?? []))
			.catch(console.error)
	}, [user?.id])

	// Загружаем существующие чаты
	useEffect(() => {
		if (!user?.id) return
		fetch(`/api/chats?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setChats(data.chats ?? []))
			.catch(console.error)
	}, [user?.id])

	const openChatWithFriend = async (
		friendId: number,
		friendUsername: string
	) => {
		if (!user?.id) return

		try {
			const res = await fetch('/api/chats', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userIds: [user.id, friendId],
					title: friendUsername,
				}),
			})

			if (!res.ok) {
				const text = await res.text()
				console.error('Failed to create chat:', res.status, text)
				return
			}

			const chat = await res.json()
			setChats(prev => [...prev, chat])
			setActiveChatId(chat.id)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<div className='h-screen w-full bg-black text-white'>
			{activeChatId === null ? (
				<ChatList
					chats={chats}
					friends={friends}
					onOpenChat={setActiveChatId}
					onOpenFriendChat={openChatWithFriend}
				/>
			) : (
				<ChatWindow chat={activeChat!} onBack={() => setActiveChatId(null)} />
			)}
		</div>
	)
}
