import { create } from 'zustand'

interface User {
	email: string
	bio: string
	avatarUrl: string
	name: string
	username: string
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
	setSelectedPage: (page: string) => set({ selectedPage: page }),
	setIsLogged: (status: boolean) => set({ isLogged: status }),
	setUser: (user: User | null) => set({ user }),
}))

export default nexoStore
