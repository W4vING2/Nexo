'use client'

import nexoStore from '@/store/nexoStore'
import Chat from '../pages/Chat'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import Search from '../pages/Search'

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
