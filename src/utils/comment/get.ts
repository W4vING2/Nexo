'use server'

import prisma from '@/../lib/prisma'

export interface CommentWithUserData {
	id: number
	postId: number
	userId: number
	username: string
	avatarUrl: string
	text: string
	createdAt: string
}

export async function get(postId: number): Promise<CommentWithUserData[]> {
	if (isNaN(postId)) {
		throw new Error('Invalid postId')
	}

	try {
		const comments = await prisma.comment.findMany({
			where: { postId },
			include: { user: { select: { username: true, avatarUrl: true } } },
			orderBy: { createdAt: 'asc' },
		})

		return comments.map(c => ({
			id: c.id,
			postId: c.postId,
			userId: c.userId,
			username: c.user?.username ?? 'Неизвестный',
			avatarUrl: c.user?.avatarUrl ?? '/logo.png',
			text: c.text,
			createdAt: c.createdAt.toISOString(),
		}))
	} catch (err) {
		console.error(err)
		throw new Error('Failed to fetch comments')
	}
}
