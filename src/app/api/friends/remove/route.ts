import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const { userId, friendId } = await req.json()

	if (!userId || !friendId) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
	}

	await prisma.friend.deleteMany({
		where: {
			OR: [
				{ userId, friendId },
				{ userId: friendId, friendId: userId },
			],
		},
	})

	return NextResponse.json({ ok: true })
}
