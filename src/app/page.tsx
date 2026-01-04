'use client'

import FooterBar from '@/components/ui/FooterBar'
import Header from '@/components/ui/Header'
import Main from '@/components/ui/Main'
import nexoStore from '@/store/nexoStore'
import Sign from '../components/Sign'

export default function HomePage() {
	const { isLogged } = nexoStore()
	const pastUser = localStorage.getItem('user')
	if (pastUser && !isLogged) {
		nexoStore.getState().setIsLogged(true)
		const user = JSON.parse(pastUser)
		nexoStore.getState().setUser(user)
	}
	return (
		<>
			{isLogged ? (
				<>
					<Header />
					<Main />
					<FooterBar />
				</>
			) : (
				<Sign />
			)}
		</>
	)
}
