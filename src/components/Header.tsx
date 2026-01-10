'use client'

import nexoStore from '@/store/nexoStore'
import Image from 'next/image'

export default function Header() {
	const { user } = nexoStore()

	return (
		<header className='fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-gray-800 h-14'>
			<div className='flex items-center justify-between h-full px-4 max-w-xl mx-auto'>
				<div className='flex items-center gap-2'>
					<Image
						src={user?.avatarUrl || '/logo.png'} // напрямую берем аватарку
						alt='avatar'
						width={32}
						height={32}
						className='w-8 h-8 rounded-full object-cover'
						loading='eager'
					/>
				</div>
				<p className='font-extrabold text-lg tracking-tight'>Nexo</p>
				<div className='w-8 h-8' />
			</div>
		</header>
	)
}
