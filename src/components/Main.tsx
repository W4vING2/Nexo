'use client'

import nexoStore from '@/store/nexoStore'
import Chat from './sections/Chat'
import Home from './sections/Home'
import Profile from './sections/Profile'
import Search from './sections/Search'

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
