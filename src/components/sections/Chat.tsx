'use client'

import { useState } from 'react'
import ChatList from '../chat/ChatList'
import ChatWindow from '../chat/ChatWindow'

interface Chat {
	id: number
	title: string
}

const MOCK_CHATS: Chat[] = [
	{ id: 1, title: 'H' },
	{ id: 2, title: 'B' },
	{ id: 3, title: 'O' },
]

export default function MobileChat() {
	const [activeChatId, setActiveChatId] = useState<number | null>(null)

	const activeChat = MOCK_CHATS.find(c => c.id === activeChatId) || null

	return (
		<div className='h-screen w-full bg-black text-white'>
			{activeChatId === null ? (
				<ChatList chats={MOCK_CHATS} onOpenChat={setActiveChatId} />
			) : (
				<ChatWindow chat={activeChat!} onBack={() => setActiveChatId(null)} />
			)}
		</div>
	)
}
