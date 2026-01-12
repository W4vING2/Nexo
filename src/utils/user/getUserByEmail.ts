'use server'

import prisma from '@/../lib/prisma'

export interface UserWithEmail {
	id: number
	name: string | null
	username: string
	email: string
	bio: string | null
	avatarUrl: string | null
}

export const getUserByForm = async (formData: FormData) => {
	const user = await prisma.user.findUnique({
		where: {
			email: formData.get('email') as string,
		},
	})
	return user
}

export async function getUserByEmail(email: string) {
	if (!email) {
		throw new Error('Email is required')
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				name: true,
				username: true,
				email: true,
				bio: true,
				avatarUrl: true,
			},
		})

		if (!user) return null

		return user
	} catch (err) {
		console.error('Failed to fetch user:', err)
		throw new Error('Internal server error')
	}
}
