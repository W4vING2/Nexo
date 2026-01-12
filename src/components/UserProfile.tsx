'use client'

import nexoStore from '@/store/nexoStore'
import { createRequest } from '@/utils/friend/createRequest'
import { getStatus } from '@/utils/friend/getStatus'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../shared/Button'

export interface UserType {
	id: number
	username: string
	email?: string | null
	avatarUrl?: string | null
	name?: string | null
	bio?: string | null
}

export default function UserProfile({ profile }: { profile: UserType }) {
	const { user: currentUser } = nexoStore()
	const [isFriend, setIsFriend] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const checkFriendStatus = async () => {
			if (!currentUser?.id || currentUser.id === profile.id) return
			const status = await getStatus(currentUser.id, profile.id)
			setIsFriend(status.isFriend)
		}

		checkFriendStatus()
	}, [currentUser?.id, profile.id])

	const handleAddFriend = async () => {
		if (!currentUser?.id || isLoading) return
		setIsLoading(true)
		await createRequest(currentUser.id, profile.id)
		alert('Заявка в друзья отправлена!')
		setIsLoading(false)
	}

	return (
		<div className='bg-gray-900 rounded-2xl p-6'>
			<div className='flex flex-col items-center gap-4'>
				<div className='relative'>
					<Image
						src={profile.avatarUrl || '/logo.png'}
						alt={`@${profile.username}`}
						width={120}
						height={120}
						className='rounded-full'
					/>
				</div>
				<div className='text-center'>
					<h2 className='text-2xl font-bold'>@{profile.username}</h2>
					{profile.name && <p className='text-gray-400'>{profile.name}</p>}
					{profile.bio && <p className='mt-2 text-gray-300'>{profile.bio}</p>}
				</div>

				{currentUser?.id !== profile.id && (
					<Button
						variant={isFriend ? 'secondary' : 'primary'}
						onClick={handleAddFriend}
						disabled={isLoading || isFriend}
						className='w-full max-w-xs'
					>
						{isLoading
							? 'Отправка...'
							: isFriend
							? 'В друзьях'
							: 'Добавить в друзья'}
					</Button>
				)}
			</div>
		</div>
	)
}
