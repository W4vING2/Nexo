import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
	params: { id: string } | Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: Params) {
	const { id } = await params
	const postId = Number(id)
	const userId = Number(req.nextUrl.searchParams.get('userId'))

	if (!Number.isInteger(postId)) {
		return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
	}
	if (!userId) {
		return NextResponse.json({ error: 'User ID not provided' }, { status: 400 })
	}

	try {
		const reaction = await prisma.postReaction.findUnique({
			where: { userId_postId: { userId, postId } },
		})

		return NextResponse.json({ type: reaction?.type ?? null })
	} catch (err) {
		console.error('Ошибка получения реакции:', err)
		return NextResponse.json({ error: 'DB error' }, { status: 500 })
	}
}
