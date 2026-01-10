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

export interface Post {
	id: number
	content: string
	createdAt: Date
	likes: number
	dislikes: number
	authorId: number
}

export interface PageProps {
	params: Promise<{
		username: string
	}>
}
