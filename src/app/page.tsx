'use client'

import FooterBar from '@/components/FooterBar'
import Header from '@/components/Header'
import Main from '@/components/Main'
import nexoStore from '@/store/nexoStore'
import { useEffect } from 'react'
import Sign from '../components/auth/Sign'

export default function HomePage() {
	const { isLogged, setIsLogged, setUser } = nexoStore()

	useEffect(() => {
		const pastUser = localStorage.getItem('user')
		if (pastUser && !isLogged) {
			const user = JSON.parse(pastUser)
			setUser(user)
			setIsLogged(true)
		}
	}, [isLogged, setIsLogged, setUser])

	if (!isLogged) return <Sign />

	return (
		<div className='flex flex-col h-screen'>
			<Header />
			<div className='flex-1 overflow-y-auto'>
				<Main />
			</div>
			<FooterBar />
		</div>
	)
}
