'use client'

import nexoStore from '@/store/nexoStore'
import Image from 'next/image'
import ProfileEditModal from './ui/ProfileEdit'

export default function Profile() {
	const { user } = nexoStore()

	if (!user) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white px-4'>
				<p className='text-gray-400 text-lg'>Пользователь не найден</p>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white'>
			<div className='relative h-40 bg-gray-800/80 backdrop-blur-md shadow-lg'>
				<div className='absolute -bottom-12 left-4'>
					<Image
						width={600}
						height={600}
						src={user.avatarUrl || '/logo.png'}
						alt='avatar'
						className='w-28 h-28 rounded-full border-4 border-gray-900 object-cover shadow-xl'
					/>
				</div>
			</div>

			<div className='pt-16 px-4 max-w-xl mx-auto'>
				<div className='flex justify-between items-start'>
					<div>
						<h1 className='text-2xl font-extrabold leading-tight'>
							{user.name}
						</h1>
						<p className='text-gray-400 text-sm mt-1'>@{user.username}</p>
					</div>

					<ProfileEditModal />
				</div>

				{user.bio && (
					<p className='mt-3 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-xl backdrop-blur-sm'>
						{user.bio}
					</p>
				)}

				<div className='mt-6 border-b border-gray-800 flex rounded-xl overflow-hidden shadow-sm'>
					<button className='flex-1 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition'>
						Посты
					</button>
				</div>

				<div className='py-10 text-center text-gray-400'>Пока нет постов</div>
			</div>
		</div>
	)
}
