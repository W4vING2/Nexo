import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const { userId, friendId } = await req.json()

	if (!userId || !friendId) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
	}

	const isFriend = await prisma.friend.findFirst({
		where: {
			OR: [
				{ userId, friendId },
				{ userId: friendId, friendId: userId },
			],
		},
	})

	if (!isFriend) {
		return NextResponse.json({ error: 'Not friends' }, { status: 403 })
	}

	const existingChat = await prisma.chat.findFirst({
		where: {
			users: {
				every: {
					userId: { in: [userId, friendId] },
				},
			},
		},
		include: { users: true },
	})

	if (existingChat) {
		return NextResponse.json(existingChat)
	}

	const chat = await prisma.chat.create({
		data: {
			users: {
				createMany: {
					data: [{ userId }, { userId: friendId }],
				},
			},
		},
		include: { users: true },
	})

	return NextResponse.json(chat)
}
