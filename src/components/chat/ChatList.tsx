'use client'

interface Chat {
	id: number
	title: string
}

interface Friend {
	id: number
	username: string
	avatarUrl?: string
}

interface Props {
	chats: Chat[]
	friends: Friend[]
	onOpenChat: (id: number) => void
	onOpenFriendChat: (friendId: number, friendUsername: string) => void
}

export default function ChatList({
	chats,
	friends,
	onOpenChat,
	onOpenFriendChat,
}: Props) {
	return (
		<div className='flex flex-col h-full'>
			<div className='flex-1 overflow-y-auto'>
				{/* Список существующих чатов */}
				{chats.map(chat => (
					<button
						key={chat.id}
						onClick={() => onOpenChat(chat.id)}
						className='w-full text-left px-4 py-3 border-b border-gray-800 hover:bg-gray-900'
					>
						<p className='font-medium'>{chat.title}</p>
					</button>
				))}
				{/* Список друзей, с которыми ещё нет чата */}
				{friends.map(friend => {
					const hasChat = chats.some(
						c => c.title === friend.username // или проверка по userIds, если есть
					)
					if (hasChat) return null
					return (
						<button
							key={friend.id}
							onClick={() => onOpenFriendChat(friend.id, friend.username)}
							className='w-full text-left px-4 py-3 border-b border-gray-800 hover:bg-gray-900'
						>
							<p className='font-medium'>@{friend.username}</p>
						</button>
					)
				})}

				{chats.length === 0 && friends.length === 0 && (
					<p className='text-gray-400 p-4'>У вас пока нет чатов или друзей</p>
				)}
			</div>
		</div>
	)
}
