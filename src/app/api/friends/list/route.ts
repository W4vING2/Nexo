import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const userId = Number(req.nextUrl.searchParams.get('userId'))

	if (!userId) {
		return NextResponse.json({ error: 'No userId' }, { status: 400 })
	}

	const friends = await prisma.friend.findMany({
		where: { userId },
		include: {
			friend: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	})

	return NextResponse.json({
		friends: friends.map(f => f.friend),
	})
}
