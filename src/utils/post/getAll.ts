'use server'

import prisma from '@/../lib/prisma'
import { PostType } from '@/types/post.types'

export async function getAll(): Promise<PostType[]> {
	try {
		const posts = await prisma.post.findMany({
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				content: true,
				createdAt: true,
				likes: true,
				dislikes: true,
				author: {
					select: {
						id: true,
						username: true,
						avatarUrl: true,
					},
				},
			},
		})

		return posts.map(post => ({
			id: post.id,
			content: post.content,
			createdAt: post.createdAt.toISOString(),
			likes: post.likes,
			dislikes: post.dislikes,
			authorId: post.author.id,
			author: {
				id: post.author.id,
				username: post.author.username,
				avatarUrl: post.author.avatarUrl,
			},
		})) satisfies PostType[]
	} catch (err) {
		console.error('GET Posts error:', err)
		return []
	}
}
