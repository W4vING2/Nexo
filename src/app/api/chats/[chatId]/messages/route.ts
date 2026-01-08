import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// App Router динамический маршрут: /api/chats/[chatId]/messages/route.ts
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ chatId: string }> } // params теперь Promise
) {
	const resolvedParams = await params
	const chatId = Number(resolvedParams.chatId)

	if (!Number.isInteger(chatId)) {
		return NextResponse.json({ error: 'Invalid chatId' }, { status: 400 })
	}

	const messages = await prisma.message.findMany({
		where: { chatId },
		orderBy: { createdAt: 'asc' },
		include: {
			user: { select: { id: true, username: true, avatarUrl: true } },
		},
	})

	return NextResponse.json(messages)
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ chatId: string }> }
) {
	const resolvedParams = await params
	const chatId = Number(resolvedParams.chatId)
	const { userId, text } = await req.json()

	if (!Number.isInteger(chatId) || !userId || !text?.trim()) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
	}

	const message = await prisma.message.create({
		data: { chatId, userId, text },
		include: {
			user: { select: { id: true, username: true, avatarUrl: true } },
		},
	})

	return NextResponse.json(message)
}
