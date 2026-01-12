'use server'

import prisma from '@/../lib/prisma'
import { FriendRequest } from '@/types/friend.types'

export async function getRequests(userId: string): Promise<FriendRequest[]> {
	if (!userId) throw new Error('userId is required')

	const requests = await prisma.friendRequest.findMany({
		where: { toUserId: Number(userId) },
		include: {
			fromUser: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
				},
			},
		},
	})

	// 🔥 ПРИВОДИМ PRISMA → FRONTEND TYPE
	return requests.map(r => ({
		id: r.id,
		fromUser: {
			id: r.fromUser.id,
			username: r.fromUser.username ?? 'Неизвестный',
			avatarUrl: r.fromUser.avatarUrl,
		},
	}))
}
