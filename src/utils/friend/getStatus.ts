'use server'

import prisma from '@/../lib/prisma'

export async function getStatus(userId: number, targetId: number) {
	if (!userId || !targetId) {
		throw new Error('userId and targetId are required')
	}

	try {
		const friend = await prisma.friend.findFirst({
			where: {
				OR: [
					{ userId, friendId: targetId },
					{ userId: targetId, friendId: userId },
				],
			},
		})

		return { isFriend: !!friend }
	} catch (err) {
		console.error('GET /api/friends/status error:', err)
		throw new Error('Server error')
	}
}
