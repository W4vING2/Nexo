'use server'

import prisma from '@/../lib/prisma'

export async function getUserByUsername(username: string) {
	if (!username) return null

	return prisma.user.findUnique({
		where: { username },
		select: {
			email: true,
			name: true,
			username: true,
			bio: true,
			avatarUrl: true,
			createdAt: true,
		},
	})
}
