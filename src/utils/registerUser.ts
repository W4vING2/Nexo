'use server'

import prisma from '../../lib/prisma'

export default async function registerUser(formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const name = formData.get('username') as string
	if (!email || !password) throw new Error('Email and password are required')
	console.log('User was registered:', { email, password, name })
	await prisma.user.create({
		data: {
			email,
			password,
			name,
		},
	})
}
