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
