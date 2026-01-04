'use client'

import nexoStore from '@/store/nexoStore'
import Image from 'next/image'

export default function Header() {
	const { user } = nexoStore()

	return (
		<header className='sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-gray-800'>
			<div className='flex items-center justify-between h-14 px-4 max-w-xl mx-auto'>
				<div className='flex items-center gap-2'>
					<Image
						src={user?.avatarUrl || '/logo.png'}
						alt='avatar'
						width={32}
						height={32}
						className='w-8 h-8 rounded-full object-cover'
					/>
				</div>

				<p className='font-extrabold text-lg tracking-tight'>Nexo</p>

				<div className='w-8 h-8' />
			</div>
		</header>
	)
}
