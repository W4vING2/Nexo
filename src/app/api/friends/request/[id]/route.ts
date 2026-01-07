import prisma from '@/../lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	ctx: { params: Promise<{ id: string }> }
) {
	const { id } = await ctx.params
	const requestId = Number(id)

	if (!id || Number.isNaN(requestId)) {
		return NextResponse.json({ error: 'Invalid request id' }, { status: 400 })
	}

	const { accept } = await req.json()

	const request = await prisma.friendRequest.findUnique({
		where: { id: requestId },
	})

	if (!request) {
		return NextResponse.json(
			{ error: 'Friend request not found' },
			{ status: 404 }
		)
	}

	if (accept === true) {
		await prisma.friend.createMany({
			data: [
				{ userId: request.fromUserId, friendId: request.toUserId },
				{ userId: request.toUserId, friendId: request.fromUserId },
			],
			skipDuplicates: true,
		})
	}

	await prisma.friendRequest.delete({
		where: { id: requestId },
	})

	return NextResponse.json({ ok: true })
}
