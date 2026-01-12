'use server'

import prisma from '@/../lib/prisma'

export async function toggleReaction(
	postId: number,
	userId: number,
	type: 'like' | 'dislike'
) {
	if (!Number.isInteger(postId)) throw new Error('Invalid post ID')
	if (!userId) throw new Error('User ID not provided')
	if (!['like', 'dislike'].includes(type)) throw new Error('Invalid type')

	try {
		const existing = await prisma.postReaction.findUnique({
			where: { userId_postId: { userId, postId } },
		})

		if (!existing) {
			await prisma.postReaction.create({ data: { userId, postId, type } })
			const post = await prisma.post.update({
				where: { id: postId },
				data:
					type === 'like'
						? { likes: { increment: 1 } }
						: { dislikes: { increment: 1 } },
				select: { likes: true, dislikes: true },
			})
			return post
		}

		if (existing.type === type) {
			await prisma.postReaction.delete({
				where: { userId_postId: { userId, postId } },
			})
			const post = await prisma.post.update({
				where: { id: postId },
				data:
					type === 'like'
						? { likes: { decrement: 1 } }
						: { dislikes: { decrement: 1 } },
				select: { likes: true, dislikes: true },
			})
			return post
		}

		await prisma.postReaction.update({
			where: { userId_postId: { userId, postId } },
			data: { type },
		})

		const post = await prisma.post.update({
			where: { id: postId },
			data:
				type === 'like'
					? { likes: { increment: 1 }, dislikes: { decrement: 1 } }
					: { dislikes: { increment: 1 }, likes: { decrement: 1 } },
			select: { likes: true, dislikes: true },
		})

		return post
	} catch (err) {
		console.error(err)
		throw new Error('DB error')
	}
}
