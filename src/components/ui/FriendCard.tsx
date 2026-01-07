'use client'

import Image from 'next/image'
import Link from 'next/link'

export interface Friend {
	id: number
	username: string
	avatarUrl?: string | null
}

interface FriendCardProps {
	friend: Friend
}

export default function FriendCard({ friend }: FriendCardProps) {
	return (
		<Link
			href={`/user/${friend.username}`}
			className='flex flex-col items-center w-20 cursor-pointer group'
		>
			<div className='w-16 h-16 rounded-full bg-gray-700 overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition'>
				<Image
					src={friend.avatarUrl || '/logo.png'}
					alt={friend.username}
					width={64}
					height={64}
					className='w-full h-full object-cover'
				/>
			</div>
			<p className='text-xs mt-1 truncate text-gray-300 group-hover:text-white transition'>
				@{friend.username}
			</p>
		</Link>
	)
}
