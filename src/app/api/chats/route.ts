import prisma from '@/../lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const { userIds } = await req.json()

		if (!Array.isArray(userIds) || userIds.length < 2) {
			return NextResponse.json(
				{ error: 'At least 2 users required' },
				{ status: 400 }
			)
		}

		// Проверяем всех пользователей
		const usersExist = await prisma.user.count({
			where: { id: { in: userIds } },
		})
		if (usersExist !== userIds.length) {
			return NextResponse.json(
				{ error: 'Some users not found' },
				{ status: 400 }
			)
		}

		// Создаём чат и связи с пользователями
		const chat = await prisma.chat.create({
			data: {
				users: { create: userIds.map(id => ({ userId: id })) },
			},
			include: { users: { select: { userId: true } } },
		})

		return NextResponse.json(chat)
	} catch (err) {
		console.error('POST /api/chats error:', err)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
