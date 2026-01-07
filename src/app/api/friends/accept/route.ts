import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const { requestId } = await req.json()

	const request = await prisma.friendRequest.findUnique({
		where: { id: requestId },
	})

	if (!request) {
		return NextResponse.json({ error: 'Request not found' }, { status: 404 })
	}

	await prisma.$transaction([
		prisma.friend.create({
			data: {
				userId: request.fromUserId,
				friendId: request.toUserId,
			},
		}),
		prisma.friend.create({
			data: {
				userId: request.toUserId,
				friendId: request.fromUserId,
			},
		}),
		prisma.friendRequest.delete({
			where: { id: requestId },
		}),
	])

	return NextResponse.json({ ok: true })
}
