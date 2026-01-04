'use client'

import { PostProps } from '@/types/post.types'

export default function Post({ user, text }: PostProps) {
	return (
		<div className='flex p-5 gap-4 border-b border-gray-800 hover:bg-zinc-900 transition w-[95%] mx-auto rounded-xl'>
			<div className='w-12 h-12 rounded-full bg-zinc-700 shrink-0' />
			<div className='flex flex-col gap-2'>
				<div className='flex items-center justify-between'>
					<h1 className='font-bold text-white text-sm'>{user}</h1>
					<span className='text-gray-500 text-xs'>• 1h</span>
				</div>
				<p className='text-gray-200 text-sm leading-relaxed'>{text}</p>
			</div>
		</div>
	)
}
