'use client'

import FooterBar from '@/components/ui/FooterBar'
import Header from '@/components/ui/Header'
import Main from '@/components/ui/Main'
import nexoStore from '@/store/nexoStore'
import { useEffect } from 'react'
import Sign from '../components/Sign'

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
		<>
			<Header />
			<Main />
			<FooterBar />
		</>
	)
}
