'use client'

import nexoStore from '@/store/nexoStore'
import { useEffect, useState } from 'react'
import ChatList from '../chat/ChatList'
import ChatWindow from '../chat/ChatWindow'

interface Chat {
	id: number
	title: string
}

export default function MobileChat() {
	const { user } = nexoStore()
	const [chats, setChats] = useState<Chat[]>([])
	const [activeChatId, setActiveChatId] = useState<number | null>(null)

	const activeChat = chats.find(c => c.id === activeChatId) || null

	useEffect(() => {
		if (!user?.id) return

		fetch(`/api/chats?userId=${user.id}`)
			.then(res => res.json())
			.then(data => setChats(data.chats ?? []))
			.catch(console.error)
	}, [user?.id])

	return (
		<div className='h-screen w-full bg-black text-white'>
			{activeChatId === null ? (
				<ChatList chats={chats} onOpenChat={setActiveChatId} />
			) : (
				<ChatWindow chat={activeChat!} onBack={() => setActiveChatId(null)} />
			)}
		</div>
	)
}
