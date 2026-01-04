'use server'

import prisma from '../../lib/prisma'

export default async function autorizeUser(formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	if (!email || !password) throw new Error('Email and password are required')
	console.log('User was authorized:', { email, password })
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	})
	if (!user) throw new Error('User not found')
	if (user.password !== password) throw new Error('Invalid password')
}
