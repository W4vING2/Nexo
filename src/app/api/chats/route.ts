import prisma from '@/../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	try {
		const url = new URL(req.url)
		const userId = Number(url.searchParams.get('userId'))
		if (!userId)
			return NextResponse.json({ error: 'userId required' }, { status: 400 })

		const chats = await prisma.chat.findMany({
			where: { users: { some: { userId } } },
			include: {
				users: {
					select: {
						userId: true,
						user: { select: { id: true, username: true, avatarUrl: true } },
					},
				},
				messages: { take: 1, orderBy: { createdAt: 'desc' } },
			},
		})

		// Фильтруем пустых пользователей
		const sanitized = chats.map(c => ({
			...c,
			users: c.users.filter(u => u.user !== null),
		}))
		return NextResponse.json({ chats: sanitized })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
