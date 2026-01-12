'use server'

import prisma from '@/../lib/prisma'

export async function createRequest(
	fromUserId: number,
	toUserId: number
): Promise<void> {
	if (!fromUserId || !toUserId || fromUserId === toUserId) {
		throw new Error('Invalid data')
	}

	try {
		const from = await prisma.user.findUnique({ where: { id: fromUserId } })
		const to = await prisma.user.findUnique({ where: { id: toUserId } })

		if (!from || !to) {
			throw new Error('User not found')
		}

		await prisma.friendRequest.create({
			data: { fromUserId, toUserId },
		})
	} catch (e) {
		console.error(e)
		throw new Error('Server error')
	}
}
