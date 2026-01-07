'use client'

interface Chat {
	id: number
	title: string
}

interface Props {
	chats: Chat[]
	onOpenChat: (id: number) => void
}

export default function ChatList({ chats, onOpenChat }: Props) {
	return (
		<div className='flex flex-col h-full'>
			<h1 className='p-4 text-lg font-bold border-b border-gray-800'>Чаты</h1>

			<div className='flex-1 overflow-y-auto'>
				{chats.map(chat => (
					<button
						key={chat.id}
						onClick={() => onOpenChat(chat.id)}
						className='w-full text-left px-4 py-3 border-b border-gray-800 hover:bg-gray-900'
					>
						<p className='font-medium'>{chat.title}</p>
					</button>
				))}
				{chats.length === 0 && (
					<p className='text-gray-400 p-4'>У вас пока нет чатов</p>
				)}
			</div>
		</div>
	)
}
