'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
	const router = useRouter()
	return (
		<button
			onClick={() => router.push('/')}
			className='mt-4 px-6 py-2 bg-linear-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-full hover:from-gray-600 hover:to-gray-700 transition w-max'
		>
			Назад
		</button>
	)
}
