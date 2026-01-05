'use client'

import nexoStore from '@/store/nexoStore'
import { searchUsersByUsername } from '@/utils/searchUser'
import { Search as SearchIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
	id: number
	username: string | null
	avatarUrl: string | null
}

export default function Search() {
	const { user: currentUser } = nexoStore()
	const [query, setQuery] = useState('')
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		let active = true

		if (query.length < 1) {
			setUsers([])
			setLoading(false)
			return
		}

		setLoading(true)

		const timeout = setTimeout(async () => {
			try {
				const result = await searchUsersByUsername(query)
				if (active) {
					const filtered = result.filter(
						u => u.username !== currentUser?.username
					)
					setUsers(filtered)
				}
			} catch {
				if (active) {
					setUsers([])
				}
			} finally {
				if (active) setLoading(false)
			}
		}, 300)

		return () => {
			active = false
			clearTimeout(timeout)
		}
	}, [query, currentUser])

	const handleUserClick = (username: string | null) => {
		if (!username) return
		router.push(`/user/${username}`)
	}

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
							placeholder='Поиск по username'
							value={query}
							onChange={e => setQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-2 rounded-full bg-zinc-900 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
						/>
					</div>
				</div>
			</div>

			<div className='max-w-xl mx-auto px-4 pt-6 flex flex-col gap-3'>
				{loading && <p className='text-gray-400 text-sm'>Поиск...</p>}

				{!loading && users.length === 0 && query.length >= 1 && (
					<p className='text-gray-400 text-sm'>Ничего не найдено</p>
				)}

				{users.map(user => (
					<div
						key={user.id}
						onClick={() => handleUserClick(user.username)}
						className='flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/50 transition cursor-pointer'
					>
						<div className='w-10 h-10 rounded-full bg-gray-700 overflow-hidden'>
							{user.avatarUrl && (
								<Image
									src={user.avatarUrl}
									alt=''
									width={40}
									height={40}
									className='w-full h-full object-cover'
								/>
							)}
						</div>

						<p className='font-medium'>@{user.username}</p>
					</div>
				))}
			</div>
		</div>
	)
}
