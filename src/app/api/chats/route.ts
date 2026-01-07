import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const userId = Number(req.nextUrl.searchParams.get('userId'))

	if (!userId) {
		return NextResponse.json({ error: 'userId is required' }, { status: 400 })
	}

	try {
		// Получаем все чаты, где есть этот пользователь
		const chats = await prisma.chatUser.findMany({
			where: { userId },
			include: { chat: true },
		})

		const formattedChats = chats.map(c => ({
			id: c.chat.id,
			title: `Чат #${c.chat.id}`,
		}))

		return NextResponse.json({ chats: formattedChats })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'DB error' }, { status: 500 })
	}
}
