export interface Friend {
	id: number
	username: string
	avatarUrl?: string | null
}

export interface Message {
	id: number
	chatId: number
	userId: number
	text: string
	createdAt: Date
	user?: {
		id: number
		username: string
		avatarUrl?: string | null
	} | null
}

export interface ChatUser {
	userId: number
	user?: {
		id: number
		username: string
		avatarUrl?: string | null
	} | null
}

export interface Chat {
	id: number
	createdAt: string
	users: ChatUser[]
	messages: Message[]
}
