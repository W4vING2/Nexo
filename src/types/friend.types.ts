export interface Friend {
	id: number
	username: string
	avatarUrl?: string | null
}

export interface FriendRequest {
	id: number
	fromUser: {
		id: number
		username: string
		avatarUrl?: string | null
	}
}
