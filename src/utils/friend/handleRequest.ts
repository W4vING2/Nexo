'use server'

import prisma from '@/../lib/prisma'

export async function handleRequest(
	requestId: number,
	accept: boolean
): Promise<void> {
	if (!requestId || isNaN(requestId)) {
		throw new Error('Invalid request id')
	}

	try {
		const request = await prisma.friendRequest.findUnique({
			where: { id: requestId },
		})

		if (!request) {
			throw new Error('Friend request not found')
		}

		if (accept === true) {
			await prisma.friend.createMany({
				data: [
					{ userId: request.fromUserId, friendId: request.toUserId },
					{ userId: request.toUserId, friendId: request.fromUserId },
				],
				skipDuplicates: true,
			})
		}

		await prisma.friendRequest.delete({
			where: { id: requestId },
		})
	} catch (error) {
		console.error(error)
		throw new Error('Failed to handle friend request')
	}
}
