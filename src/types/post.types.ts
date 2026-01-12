export interface PostProps {
	avatar?: string
	user: string
	text: string
	createdAt?: string
	id: number
	likes?: number
	authorId: number
	dislikes?: number
}

export interface PostType {
	id: number
	content: string
	createdAt: string
	likes: number
	dislikes: number
	authorId: number
	author: {
		id: number
		username: string | null
		avatarUrl: string | null
	}
}

export type PostResponseType = {
	id: number
	user: string
	avatar: string | null
	text: string
	likes: number
	dislikes: number
	createdAt: string
}

export interface PageProps {
	params: Promise<{
		username: string
	}>
}
