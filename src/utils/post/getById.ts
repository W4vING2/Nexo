'use server'

import prisma from '@/../lib/prisma'
import type { PostResponseType } from '@/types/post.types'

export async function getById(
	postId: number
): Promise<PostResponseType & { authorId: number }> {
	if (!Number.isInteger(postId)) {
		throw new Error('Invalid post id')
	}

	const post = await prisma.post.findUnique({
		where: { id: postId },
		select: {
			id: true,
			content: true,
			likes: true,
			dislikes: true,
			createdAt: true,
			author: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
				},
			},
		},
	})

	if (!post) {
		throw new Error('Post not found')
	}

	return {
		id: post.id,
		user: post.author.username ?? 'Неизвестный',
		avatar: post.author.avatarUrl,
		text: post.content,
		likes: post.likes,
		dislikes: post.dislikes,
		createdAt: post.createdAt.toISOString(),
		authorId: post.author.id,
	}
}
