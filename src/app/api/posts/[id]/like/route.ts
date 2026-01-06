import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
	_: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params
	const postId = Number(id)

	if (!Number.isInteger(postId)) {
		return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
	}

	try {
		const post = await prisma.post.update({
			where: { id: postId },
			data: { likes: { increment: 1 } },
			select: { id: true, likes: true, dislikes: true },
		})

		return NextResponse.json(post)
	} catch (err) {
		console.error('Ошибка лайка:', err)
		return NextResponse.json({ error: 'DB error' }, { status: 500 })
	}
}
