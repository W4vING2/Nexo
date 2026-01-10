import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
	id: number
	email: string
	name: string
	username: string | null
	bio: string | null
	avatarUrl: string | null
}

export interface StoreState {
	user: User | null
	isLogged: boolean
	selectedPage: string
	setSelectedPage: (page: string) => void
	setIsLogged: (status: boolean) => void
	setUser: (user: User | null) => void
}

const nexoStore = create<StoreState>()(
	persist(
		set => ({
			user: null,
			isLogged: false,
			selectedPage: 'home',

			setSelectedPage: page => set({ selectedPage: page }),

			setIsLogged: status => set({ isLogged: status }),

			setUser: user =>
				set({
					user,
					isLogged: !!user,
				}),
		}),
		{
			name: 'nexo-user', // ключ в localStorage
		}
	)
)

export default nexoStore
