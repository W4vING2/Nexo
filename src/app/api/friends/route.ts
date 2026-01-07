import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const userId = Number(req.nextUrl.searchParams.get('userId'))

	if (!userId || isNaN(userId)) {
		return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
	}

	try {
		const friends = await prisma.friend.findMany({
			where: { userId },
			include: {
				friend: { select: { id: true, username: true, avatarUrl: true } },
			},
		})

		const formatted = friends.map(f => ({
			id: f.friend.id,
			username: f.friend.username,
			avatarUrl: f.friend.avatarUrl,
		}))

		return NextResponse.json({ friends: formatted })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'DB error' }, { status: 500 })
	}
}
