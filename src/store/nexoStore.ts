import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoreState } from './store.types'

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
			name: 'nexo-user',
		}
	)
)

export default nexoStore
