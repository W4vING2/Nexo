import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Params = { params: { chatId: string } }

export async function GET(req: NextRequest, context: Params) {
	// Разворачиваем Promise
	const { chatId: chatIdStr } = await context.params
	const chatId = Number(chatIdStr)

	if (!chatId || chatId <= 0) {
		return NextResponse.json({ error: 'Invalid chatId' }, { status: 400 })
	}

	try {
		const messages = await prisma.message.findMany({
			where: { chatId },
			orderBy: { createdAt: 'asc' },
			include: {
				user: { select: { id: true, username: true, avatarUrl: true } },
			},
		})
		return NextResponse.json(messages ?? [])
	} catch (err) {
		console.error('GET /messages error', err)
		return NextResponse.json([], { status: 200 })
	}
}

export async function POST(req: NextRequest, context: Params) {
	const { chatId: chatIdStr } = await context.params
	const chatId = Number(chatIdStr)
	const { userId, text } = await req.json()

	if (!chatId || chatId <= 0 || !userId || !text?.trim()) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
	}

	const message = await prisma.message.create({
		data: { chatId, userId: Number(userId), text },
		include: {
			user: { select: { id: true, username: true, avatarUrl: true } },
		},
	})

	return NextResponse.json(message)
}
