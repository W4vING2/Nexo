'use client'

import nexoStore from '@/store/nexoStore'
import { useEffect, useRef, useState } from 'react'

interface Chat {
	id: number
	title: string
}

interface Message {
	id: number
	text: string
	user: { id: number; username: string }
	createdAt: string
}

interface Props {
	chat: Chat
	onBack: () => void
}

export default function ChatWindow({ chat, onBack }: Props) {
	const { user } = nexoStore()
	const [messages, setMessages] = useState<Message[]>([])
	const [text, setText] = useState('')
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!chat) return
		fetch(`/api/chats/${chat.id}/messages`)
			.then(res => res.json())
			.then(data => setMessages(data ?? []))
			.catch(console.error)
	}, [chat])

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const send = async () => {
		if (!text.trim() || !user) return
		const body = { text, userId: user.id }

		const res = await fetch(`/api/chats/${chat.id}/messages`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})
		const newMessage = await res.json()
		setMessages(prev => [...prev, newMessage])
		setText('')
	}

	return (
		<div className='flex flex-col h-[88vh]'>
			<div className='flex items-center gap-3 p-4 border-b border-gray-800'>
				<button onClick={onBack} className='text-blue-500'>
					←
				</button>
				<h2 className='font-bold'>{chat.title}</h2>
			</div>

			<div className='flex-1 overflow-y-auto p-4 space-y-2'>
				{messages.map(msg => (
					<div
						key={msg.id}
						className={`flex ${
							msg.user.id === user?.id ? 'justify-end' : 'justify-start'
						}`}
					>
						<div
							className={`px-3 py-2 rounded-xl w-max max-w-[80%] wrap-break-words ${
								msg.user.id === user?.id
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

			<div className='p-3 border-t border-gray-800 flex gap-2'>
				<input
					value={text}
					onChange={e => setText(e.target.value)}
					onKeyDown={e => e.key === 'Enter' && send()}
					className='flex-1 bg-gray-800 rounded-full px-4 py-2 outline-none'
					placeholder='Написать сообщение...'
				/>
				<button onClick={send} className='bg-blue-600 px-4 py-2 rounded-full'>
					➤
				</button>
			</div>
		</div>
	)
}
