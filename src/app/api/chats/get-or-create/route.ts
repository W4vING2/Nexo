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

		const sortedIds = [...userIds].sort((a, b) => a - b)

		// Проверяем существующие чаты
		const existingChats = await prisma.chat.findMany({
			where: {
				AND: sortedIds.map(id => ({
					users: { some: { userId: id } },
				})),
			},
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

		const chat = existingChats.find(c => {
			const ids = c.users.map(u => u.userId).sort((a, b) => a - b)
			return JSON.stringify(ids) === JSON.stringify(sortedIds)
		})

		if (chat) return NextResponse.json(chat)

		const newChat = await prisma.chat.create({
			data: {
				users: { create: userIds.map(id => ({ userId: id })) },
			},
			include: {
				users: {
					select: {
						userId: true,
						user: { select: { id: true, username: true, avatarUrl: true } },
					},
				},
				messages: true,
			},
		})

		return NextResponse.json(newChat)
	} catch (err) {
		console.error('POST /api/chats/get-or-create error:', err)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
