import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type Params = {
	params: Promise<{ chatId: string }>
}

export async function GET(req: NextRequest, { params }: Params) {
	const { chatId } = await params
	const id = Number(chatId)

	if (!Number.isInteger(id)) {
		return NextResponse.json({ error: 'Invalid chatId' }, { status: 400 })
	}

	const messages = await prisma.message.findMany({
		where: { chatId: id },
		orderBy: { createdAt: 'asc' },
		include: {
			user: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
				},
			},
		},
	})

	return NextResponse.json(messages)
}

export async function POST(req: NextRequest, { params }: Params) {
	const { chatId } = await params
	const id = Number(chatId)

	const { userId, text } = await req.json()

	if (!Number.isInteger(id) || !userId || !text?.trim()) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
	}

	const message = await prisma.message.create({
		data: {
			chatId: id,
			userId,
			text,
		},
		include: {
			user: {
				select: {
					id: true,
					username: true,
					avatarUrl: true,
				},
			},
		},
	})

	return NextResponse.json(message)
}
