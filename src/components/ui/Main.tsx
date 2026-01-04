'use client'

import nexoStore from '@/store/nexoStore'
import Chat from '../Chat'
import Home from '../Home'
import Profile from '../Profile'
import Search from '../Search'

export default function Main() {
	const { selectedPage } = nexoStore()

	switch (selectedPage) {
		case 'home':
			return <Home />
			break
		case 'search':
			return <Search />
			break
		case 'chat':
			return <Chat />
			break
		case 'profile':
			return <Profile />
			break
	}
}
