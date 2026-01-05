'use server'

import prisma from '@/../lib/prisma'
import bcrypt from 'bcryptjs'

export async function registerUser(formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const username = formData.get('username') as string

	if (!email || !password || !username) throw new Error('Missing fields')

	const hashedPassword = await bcrypt.hash(password, 10)

	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			username,
			name: username,
		},
		select: {
			id: true,
			email: true,
			username: true,
			name: true,
			bio: true,
			avatarUrl: true,
		},
	})

	return user
}
