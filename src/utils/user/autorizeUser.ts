'use server'

import prisma from '@/../lib/prisma'
import bcrypt from 'bcryptjs'

export async function authorizeUser(formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string

	if (!email || !password) throw new Error('Email and password are required')

	const user = await prisma.user.findUnique({ where: { email } })
	if (!user) throw new Error('User not found')

	const isValid = await bcrypt.compare(password, user.password)
	if (!isValid) throw new Error('Invalid password')

	return {
		id: user.id,
		email: user.email,
		username: user.username,
		name: user.name,
		bio: user.bio,
		avatarUrl: user.avatarUrl,
	}
}
