'use client'

import nexoStore from '@/store/nexoStore'
import { Friend, Message } from '@/types/chat.types'
import { getChatMessages } from '@/utils/chat/getChatMessages'
import { getOrCreate } from '@/utils/chat/getOrCreate'
import { sendMessage } from '@/utils/chat/sendMessage'
import { getByUserId } from '@/utils/friend/getByUserId'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export default function Chat() {
	const { user } = nexoStore()

	const [friends, setFriends] = useState<Friend[]>([])
	const [activeFriend, setActiveFriend] = useState<Friend | null>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)

	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!user?.id) return

		const fetchFriends = async () => {
			setLoading(true)
			try {
				const data = await getByUserId(user.id)
				setFriends(data)
			} catch (err) {
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchFriends()
	}, [user?.id])

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const startChat = useCallback(
		async (friend: Friend) => {
			if (!user) return

			setActiveFriend(friend)
			setMessages([])

			try {
				const chatId = await getOrCreate([user.id, friend.id])
				const msgs = await getChatMessages(Number(chatId))

				const formattedMsgs: Message[] = msgs.map(m => ({
					id: Number(m.id),
					chatId: Number(chatId),
					text: String(m.text),
					userId: Number(m.userId),
					createdAt: new Date(m.createdAt),
				}))

				setMessages(formattedMsgs)
			} catch (err) {
				console.error(err)
			}
		},
		[user]
	)

	const sendMessageHandler = useCallback(async () => {
		if (!input.trim() || !activeFriend || !user) return

		try {
			const chatId = await getOrCreate([user.id, activeFriend.id])
			const newMsgRaw = await sendMessage(Number(chatId), user.id, input.trim())

			const newMsg: Message = {
				id: Number(newMsgRaw.id),
				chatId: Number(chatId),
				text: String(newMsgRaw.text),
				userId: Number(newMsgRaw.userId),
				createdAt: new Date(newMsgRaw.createdAt),
			}

			setMessages(prev => [...prev, newMsg])
			setInput('')
		} catch (err) {
			console.error(err)
		}
	}, [input, activeFriend, user])

	// ===== Render friends list =====
	const renderedFriends = useMemo(() => {
		return friends.map(friend => (
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
		))
	}, [friends, startChat])

	// ===== Render chat messages =====
	const renderedMessages = useMemo(() => {
		return messages.map(msg => (
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
		))
	}, [messages, user?.id])

	if (loading) return <p className='p-4 text-gray-400'>Загрузка друзей...</p>

	return (
		<div className='h-[88vh] w-full bg-black text-white flex flex-col p-4 pt-14 mt-2'>
			{/* Friends list */}
			{activeFriend === null ? (
				<>
					<h2 className='text-xl font-bold mb-4'>Друзья</h2>
					{friends.length === 0 ? (
						<p className='text-gray-400'>У вас пока нет друзей</p>
					) : (
						<div className='flex flex-col gap-2'>{renderedFriends}</div>
					)}
				</>
			) : (
				<>
					{/* Chat header */}
					<div className='flex items-center mb-4'>
						<button
							className='text-blue-500 mr-3'
							onClick={() => setActiveFriend(null)}
						>
							← Назад
						</button>
						<h2 className='font-bold text-lg'>@{activeFriend.username}</h2>
					</div>

					{/* Messages */}
					<div className='flex-1 bg-gray-900 rounded p-4 mb-2 overflow-y-auto space-y-2'>
						{messages.length === 0 && (
							<p className='text-gray-400'>Пока нет сообщений</p>
						)}
						{renderedMessages}
						<div ref={bottomRef} />
					</div>

					{/* Input */}
					<div className='flex gap-2'>
						<input
							type='text'
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && sendMessageHandler()}
							className='flex-1 rounded-full px-4 py-2 bg-gray-800 outline-none text-white'
							placeholder='Написать сообщение...'
						/>
						<button
							className='bg-blue-600 px-4 py-2 rounded-full'
							onClick={sendMessageHandler}
						>
							➤
						</button>
					</div>
				</>
			)}
		</div>
	)
}
