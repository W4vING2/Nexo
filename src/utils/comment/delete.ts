'use server'

import prisma from '@/../lib/prisma'

export async function deleteComment(
	commentId: number,
	userId?: number
): Promise<{ success: true }> {
	if (!commentId || isNaN(commentId)) {
		throw new Error('Invalid commentId')
	}

	if (!userId || isNaN(userId)) {
		throw new Error('Unauthorized')
	}

	// Проверяем, что комментарий существует и принадлежит пользователю
	const comment = await prisma.comment.findUnique({
		where: { id: commentId },
		select: { userId: true },
	})

	if (!comment) {
		throw new Error('Comment not found')
	}

	if (comment.userId !== userId) {
		throw new Error('Forbidden')
	}

	await prisma.comment.delete({
		where: { id: commentId },
	})

	return { success: true }
}
