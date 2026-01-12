'use server'

import prisma from '@/../lib/prisma'

export interface UserType {
	id: number
	username: string
	name?: string | null
	bio?: string | null
	avatarUrl?: string | null
}

export default async function getAll(
	username: string
): Promise<UserType | null> {
	const user = await prisma.user.findUnique({
		where: { username },
		select: {
			id: true,
			username: true,
			name: true,
			bio: true,
			avatarUrl: true,
		},
	})

	// если юзер не найден или username NULL — считаем что нет пользователя
	if (!user || !user.username) return null

	return {
		id: user.id,
		username: user.username, // ← теперь гарантированно string
		name: user.name,
		bio: user.bio,
		avatarUrl: user.avatarUrl,
	}
}
