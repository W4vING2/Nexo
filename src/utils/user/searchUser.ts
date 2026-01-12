'use server'

import prisma from '@/../lib/prisma'

export async function searchUsersByUsername(query: string) {
	if (!query || query.length < 1) return []

	return prisma.user.findMany({
		where: {
			username: {
				contains: query,
				mode: 'insensitive',
			},
		},
		select: {
			id: true,
			username: true,
			avatarUrl: true,
		},
		take: 10,
	})
}
