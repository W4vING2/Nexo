'use client'

import { useState } from 'react'

interface Props {
	chat: {
		id: number
		title: string
	}
	onBack: () => void
}

export default function ChatWindow({ chat, onBack }: Props) {
	const [messages, setMessages] = useState<string[]>([])
	const [text, setText] = useState('')

	const send = () => {
		if (!text.trim()) return
		setMessages(prev => [...prev, text])
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
				{messages.map((msg, i) => (
					<div
						key={i}
						className='bg-blue-600 text-white px-3 py-2 rounded-xl w-max max-w-[80%]'
					>
						{msg}
					</div>
				))}
			</div>

			<div className='p-3 border-t border-gray-800 flex gap-2'>
				<input
					value={text}
					onChange={e => setText(e.target.value)}
					className='flex-1 bg-gray-800 rounded-full px-4 py-2 outline-none'
					placeholder='Сообщение'
				/>
				<button onClick={send} className='bg-blue-600 px-4 py-2 rounded-full'>
					➤
				</button>
			</div>
		</div>
	)
}
