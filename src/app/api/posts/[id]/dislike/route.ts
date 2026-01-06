import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
	req: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params
	const postId = Number(id)
	const userId = Number(req.headers.get('x-user-id'))

	if (!Number.isInteger(postId)) {
		return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
	}
	if (!userId) {
		return NextResponse.json({ error: 'User ID not provided' }, { status: 400 })
	}

	try {
		const existing = await prisma.postReaction.findUnique({
			where: { userId_postId: { userId, postId } },
		})

		if (existing)
			return NextResponse.json(
				{ error: 'Вы уже ставили реакцию' },
				{ status: 400 }
			)

		await prisma.postReaction.create({
			data: { userId, postId, type: 'dislike' },
		})

		const post = await prisma.post.update({
			where: { id: postId },
			data: { dislikes: { increment: 1 } },
			select: { id: true, likes: true, dislikes: true },
		})

		return NextResponse.json(post)
	} catch (err) {
		console.error('Ошибка дизлайка:', err)
		return NextResponse.json({ error: 'DB error' }, { status: 500 })
	}
}
