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

export async function create(
	postId: number,
	userId: number,
	text: string
): Promise<CommentWithUserData> {
	if (isNaN(postId)) {
		throw new Error('Invalid postId')
	}

	if (!userId || !text) {
		throw new Error('Missing fields')
	}

	try {
		const comment = await prisma.comment.create({
			data: {
				postId,
				userId,
				text,
			},
			include: {
				user: {
					select: { username: true, avatarUrl: true },
				},
			},
		})

		return {
			id: comment.id,
			postId: comment.postId,
			userId: comment.userId,
			username: comment.user?.username ?? 'Неизвестный',
			avatarUrl: comment.user?.avatarUrl ?? '/logo.png',
			text: comment.text,
			createdAt: comment.createdAt.toISOString(),
		}
	} catch (err) {
		console.error(err)
		throw new Error('Failed to create comment')
	}
}
