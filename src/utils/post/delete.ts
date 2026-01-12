'use server'

import prisma from '@/../lib/prisma'

const ADMIN_EMAIL = 'danilavaganov41@gmail.com'

export async function deletePost(
	postId: number,
	userId: number,
	userEmail: string
): Promise<boolean> {
	if (isNaN(postId)) {
		throw new Error('Invalid post id')
	}

	if (!userId) {
		throw new Error('Unauthorized')
	}

	try {
		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		})

		if (!post) {
			throw new Error('Post not found')
		}

		const isOwner = post.authorId === userId
		const isAdmin = userEmail === ADMIN_EMAIL

		if (!isOwner && !isAdmin) {
			throw new Error('Forbidden')
		}

		await prisma.post.delete({
			where: { id: postId },
		})

		return true
	} catch (err) {
		console.error(err)
		throw new Error('Failed to delete post')
	}
}
