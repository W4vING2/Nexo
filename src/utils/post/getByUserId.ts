'use server'

import prisma from '@/../lib/prisma'

export interface UserPost {
	id: number
	content: string
	createdAt: Date
}

export async function getPostsByUserId(userId: number): Promise<UserPost[]> {
	try {
		if (!userId) return []

		const posts = await prisma.post.findMany({
			where: { authorId: userId },
			orderBy: { createdAt: 'desc' },
			select: { id: true, content: true, createdAt: true },
		})

		return posts
	} catch (err) {
		console.error(err)
		return []
	}
}
