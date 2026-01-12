'use server'

import prisma from '@/../lib/prisma'

export async function getStats(postId: number, userId?: number) {
	if (!postId) throw new Error('Invalid post id')

	try {
		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: {
				likes: true,
				dislikes: true,
				comments: { select: { id: true } },
				reactions: userId
					? {
							where: { userId: Number(userId) },
							select: { type: true },
					  }
					: undefined,
			},
		})

		if (!post) throw new Error('Post not found')

		return {
			likes: post.likes,
			dislikes: post.dislikes,
			commentsCount: post.comments.length,
			type: post.reactions?.[0]?.type || null,
		}
	} catch (err) {
		console.error(err)
		throw new Error('Server error')
	}
}
