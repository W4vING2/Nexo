'use server'

import prisma from '@/../lib/prisma'

export async function getByUserId(userId: number) {
	if (!userId || isNaN(userId)) {
		throw new Error('Invalid user ID')
	}

	try {
		const friends = await prisma.friend.findMany({
			where: { userId },
			include: {
				friend: { select: { id: true, username: true, avatarUrl: true } },
			},
		})

		const formatted = friends.map(f => ({
			id: f.friend.id,
			username: f.friend.username ?? 'Неизвестный',
			avatarUrl: f.friend.avatarUrl,
		}))

		return formatted
	} catch (err) {
		console.error(err)
		throw new Error('DB error')
	}
}
