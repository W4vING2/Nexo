'use client'

import FooterBar from '@/components/FooterBar'
import Header from '@/components/Header'
import Main from '@/components/Main'
import nexoStore from '@/store/nexoStore'
import Sign from '../components/auth/Sign'

export default function HomePage() {
	const { isLogged } = nexoStore()

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
