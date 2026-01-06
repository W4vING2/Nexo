'use server'

import prisma from '@/../lib/prisma'
import type { UpdateUserInput } from '@/types/user.types'

export async function updateUser({
	email,
	name,
	username,
	bio,
	avatarUrl,
}: UpdateUserInput) {
	if (!email) throw new Error('Email is required')

	const updatedUser = await prisma.user.update({
		where: { email },
		data: {
			...(name && { name }),
			...(username && { username }),
			...(bio && { bio }),
			...(avatarUrl && { avatarUrl }),
		},
		select: {
			email: true,
			name: true,
			username: true,
			bio: true,
			avatarUrl: true,
		},
	})

	return updatedUser
}
