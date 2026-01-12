'use server'

import prisma from '@/../lib/prisma'

export interface CreatePostPayload {
	content: string
	userId: number
}

export interface CreatedPost {
	id: number
	content: string
	createdAt: Date
}

export async function create({
	content,
	userId,
}: CreatePostPayload): Promise<CreatedPost> {
	if (!content || !userId) {
		throw new Error('Content and userId are required')
	}

	try {
		const post = await prisma.post.create({
			data: { content, authorId: userId },
			select: { id: true, content: true, createdAt: true },
		})

		return post
	} catch (err) {
		console.error('Ошибка при создании поста:', err)
		throw new Error((err as Error).message)
	}
}
