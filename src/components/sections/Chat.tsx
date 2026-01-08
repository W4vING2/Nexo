'use client'

import nexoStore from '@/store/nexoStore'
import { Friend, Message } from '@/types/chat.types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function MobileChat() {
	const { user } = nexoStore()
	const [friends, setFriends] = useState<Friend[]>([])
	const [activeFriend, setActiveFriend] = useState<Friend | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const bottomRef = useRef<HTMLDivElement>(null)
	const [loading, setLoading] = useState(false)

	// Загружаем друзей
	useEffect(() => {
		if (!user?.id) return
		setLoading(true)
		fetch(`/api/friends?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setFriends(data.friends ?? []))
			.catch(console.error)
			.finally(() => setLoading(false))
	}, [user?.id])

	// Скролл вниз при новых сообщениях
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const startChat = async (friend: Friend) => {
		setActiveFriend(friend)
		setMessages([])

		if (!user) return
		try {
			// Создаём или получаем чат
			const res = await fetch('/api/chats/get-or-create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userIds: [user.id, friend.id] }),
			})
			if (!res.ok) throw new Error('Failed to get or create chat')

			const chatData = await res.json()
			const chatId = chatData?.id
			if (!chatId) throw new Error('Chat ID missing')

			// Получаем сообщения (может быть пусто для нового чата)
			const messagesRes = await fetch(`/api/chats/${chatId}/messages`)
			const data: Message[] = messagesRes.ok ? await messagesRes.json() : []
			setMessages(data ?? [])
		} catch (err) {
			console.error(err)
		}
	}

	const sendMessage = async () => {
		if (!input.trim() || !activeFriend || !user) return

		try {
			const userId = Number(user.id)
			const friendId = Number(activeFriend.id)
			if (!userId || !friendId) return

			// Получаем или создаём чат
			const res = await fetch('/api/chats/get-or-create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userIds: [userId, friendId] }),
			})
			if (!res.ok) throw new Error('Failed to get or create chat')
			const chat = await res.json()
			const chatId = Number(chat?.id)
			if (!chatId) throw new Error('Chat ID missing')

			// Создаём сообщение
			const text = input.trim()
			const msgRes = await fetch(`/api/chats/${chatId}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId, text }),
			})
			if (!msgRes.ok) throw new Error('Failed to send message')
			const newMessage: Message = await msgRes.json()
			setMessages(prev => [...prev, newMessage])
			setInput('')
		} catch (err) {
			console.error(err)
		}
	}

	if (loading) return <p className='p-4 text-gray-400'>Загрузка друзей...</p>

	return (
		<div className='h-[88vh] w-full bg-black text-white flex flex-col p-4'>
			{activeFriend === null ? (
				<>
					<h2 className='text-xl font-bold mb-4'>Друзья</h2>
					{friends.length === 0 ? (
						<p className='text-gray-400'>У вас пока нет друзей</p>
					) : (
						<div className='flex flex-col gap-2'>
							{friends.map(friend => (
								<button
									key={friend.id}
									className='flex items-center gap-3 p-2 bg-gray-800 rounded hover:bg-gray-700'
									onClick={() => startChat(friend)}
								>
									<Image
										src={friend.avatarUrl || '/logo.png'}
										width={40}
										height={40}
										alt={friend.username}
										className='rounded-full'
									/>
									<span>@{friend.username}</span>
								</button>
							))}
						</div>
					)}
				</>
			) : (
				<>
					{/* Окно чата */}
					<div className='flex items-center mb-4'>
						<button
							className='text-blue-500 mr-3'
							onClick={() => setActiveFriend(null)}
						>
							← Назад
						</button>
						<h2 className='font-bold text-lg'>@{activeFriend.username}</h2>
					</div>

					<div className='flex-1 bg-gray-900 rounded p-4 mb-2 overflow-y-auto space-y-2'>
						{messages.length === 0 && (
							<p className='text-gray-400'>Пока нет сообщений</p>
						)}
						{messages.map(msg => (
							<div
								key={msg.id}
								className={`flex ${
									msg.userId === user?.id ? 'justify-end' : 'justify-start'
								}`}
							>
								<div
									className={`px-3 py-2 rounded-xl w-max max-w-[80%] ${
										msg.userId === user?.id
											? 'bg-blue-600 text-white'
											: 'bg-gray-800 text-gray-200'
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}
						<div ref={bottomRef} />
					</div>

					<div className='flex gap-2'>
						<input
							type='text'
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && sendMessage()}
							className='flex-1 rounded-full px-4 py-2 bg-gray-800 outline-none text-white'
							placeholder='Написать сообщение...'
						/>
						<button
							className='bg-blue-600 px-4 py-2 rounded-full'
							onClick={sendMessage}
						>
							➤
						</button>
					</div>
				</>
			)}
		</div>
	)
}
