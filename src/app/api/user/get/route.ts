// src/app/api/user/get/route.ts
import prisma from '@/../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	const url = new URL(req.url)
	const email = url.searchParams.get('email')

	if (!email) {
		return NextResponse.json({ error: 'Email is required' }, { status: 400 })
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

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		return NextResponse.json(user)
	} catch (err) {
		console.error('Failed to fetch user:', err)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
