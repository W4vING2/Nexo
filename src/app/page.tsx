'use client'

import FooterBar from '@/components/ui/FooterBar'
import Header from '@/components/ui/Header'
import Main from '@/components/ui/Main'
import nexoStore from '@/store/nexoStore'
import Sign from '../components/Sign'

export default function HomePage() {
	const { isLogged } = nexoStore()
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
