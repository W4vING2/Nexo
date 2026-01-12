'use client'

import FooterBar from '@/layout/FooterBar'
import Header from '@/layout/Header'
import Main from '@/layout/Main'
import nexoStore from '@/store/nexoStore'
import Sign from '../components/Register'

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
