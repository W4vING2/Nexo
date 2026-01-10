'use client'

import nexoStore from '@/store/nexoStore'
import { useEffect } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
	const setUser = nexoStore(state => state.setUser)
	const setIsLogged = nexoStore(state => state.setIsLogged)

	useEffect(() => {
		const pastUser = localStorage.getItem('user')

		if (pastUser) {
			const user = JSON.parse(pastUser)
			setUser(user)
			setIsLogged(true)
		}
	})

	return <>{children}</>
}
