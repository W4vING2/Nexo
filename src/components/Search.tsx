'use client'

import { Search as SearchIcon } from 'lucide-react'

export default function Search() {
	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white'>
			<div className='sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-gray-800'>
				<div className='max-w-xl mx-auto px-4 py-2'>
					<div className='relative'>
						<SearchIcon
							size={18}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
						/>
						<input
							type='search'
							name='search'
							placeholder='Поиск'
							className='w-full pl-10 pr-4 py-2 rounded-full bg-zinc-900 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
						/>
					</div>
				</div>
			</div>

			<div className='max-w-xl mx-auto px-4 pt-6'>
				<p className='text-gray-400 text-sm'>Попробуй найти людей или посты</p>
			</div>
		</div>
	)
}
