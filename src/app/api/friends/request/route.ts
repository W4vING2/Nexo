import prisma from '@/../lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const { fromUserId, toUserId } = await req.json()

		if (!fromUserId || !toUserId || fromUserId === toUserId) {
			return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
		}

		const from = await prisma.user.findUnique({ where: { id: fromUserId } })
		const to = await prisma.user.findUnique({ where: { id: toUserId } })

		if (!from || !to) {
			return NextResponse.json({ error: 'User not found' }, { status: 400 })
		}

		await prisma.friendRequest.create({
			data: { fromUserId, toUserId },
		})

		return NextResponse.json({ ok: true })
	} catch (e) {
		console.error(e)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const userId = searchParams.get('userId')

	if (!userId) {
		return NextResponse.json({ error: 'userId is required' }, { status: 400 })
	}

	const requests = await prisma.friendRequest.findMany({
		where: { toUserId: Number(userId) },
		include: {
			fromUser: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
				},
			},
		},
	})

	return NextResponse.json({ requests })
}
