'use server'

import prisma from '@/../lib/prisma'
import type { Post } from '@/components/Profile'

export async function createPost({
	content,
	userId,
}: {
	content: string
	userId: number
}): Promise<Post> {
	if (!userId) throw new Error('User ID is required')

	return prisma.post.create({
		data: {
			content,
			authorId: userId,
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
		},
	})
}
