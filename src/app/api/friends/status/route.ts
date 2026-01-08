import prisma from '@/../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)

		const userId = Number(searchParams.get('userId'))
		const targetId = Number(searchParams.get('targetId'))

		if (!userId || !targetId) {
			return NextResponse.json(
				{ error: 'userId and targetId are required' },
				{ status: 400 }
			)
		}

		const friend = await prisma.friend.findFirst({
			where: {
				OR: [
					{ userId, friendId: targetId },
					{ userId: targetId, friendId: userId },
				],
			},
		})

		return NextResponse.json({ isFriend: !!friend })
	} catch (err) {
		console.error('GET /api/friends/status error:', err)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
