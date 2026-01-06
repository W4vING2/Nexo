import { create } from 'zustand'
import type { StoreState } from './store.types'

const nexoStore = create<StoreState>(set => ({
	user: null,
	isLogged: false,
	selectedPage: 'home',
	setSelectedPage: page => set({ selectedPage: page }),
	setIsLogged: status => set({ isLogged: status }),
	setUser: user => set({ user }),
}))

export default nexoStore
