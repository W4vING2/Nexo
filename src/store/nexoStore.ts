import { create } from 'zustand'

export interface User {
	id: number
	email: string
	name: string
	username: string | null
	bio: string | null
	avatarUrl: string | null
}

interface StoreState {
	user: User | null
	isLogged: boolean
	selectedPage: string
	setSelectedPage: (page: string) => void
	setIsLogged: (status: boolean) => void
	setUser: (user: User | null) => void
}

const nexoStore = create<StoreState>(set => ({
	user: null,
	isLogged: false,
	selectedPage: 'home',
	setSelectedPage: page => set({ selectedPage: page }),
	setIsLogged: status => set({ isLogged: status }),
	setUser: user => set({ user }),
}))

export default nexoStore
