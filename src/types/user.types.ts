export interface UpdateUserInput {
	email: string
	name?: string
	username?: string
	bio?: string
	avatarUrl?: string
}

export interface User {
	id: number
	username: string | null
	avatarUrl: string | null
}
