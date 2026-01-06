import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
	params: { id: string } | Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, { params }: Params) {
	const { id } = await params
	const postId = Number(id)
	const userId = Number(req.headers.get('x-user-id'))

	if (!Number.isInteger(postId)) {
		return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
	}
	if (!userId) {
		return NextResponse.json({ error: 'User ID not provided' }, { status: 400 })
	}

	const body = await req.json()
	const type: 'like' | 'dislike' = body.type

	if (!['like', 'dislike'].includes(type)) {
		return NextResponse.json(
			{ error: 'Invalid reaction type' },
			{ status: 400 }
		)
	}

	try {
		const existing = await prisma.postReaction.findUnique({
			where: { userId_postId: { userId, postId } },
		})

		if (existing) {
			if (existing.type === type) {
				// Если пользователь уже поставил эту же реакцию, ничего не делаем
				return NextResponse.json(
					{ error: 'Вы уже ставили эту реакцию' },
					{ status: 400 }
				)
			}

			// Меняем реакцию
			await prisma.postReaction.update({
				where: { userId_postId: { userId, postId } },
				data: { type },
			})

			const post = await prisma.post.update({
				where: { id: postId },
				data:
					type === 'like'
						? { likes: { increment: 1 }, dislikes: { decrement: 1 } }
						: { likes: { decrement: 1 }, dislikes: { increment: 1 } },
				select: { id: true, likes: true, dislikes: true },
			})

			return NextResponse.json(post)
		}

		// Если реакции ещё не было
		await prisma.postReaction.create({
			data: { userId, postId, type },
		})

		const post = await prisma.post.update({
			where: { id: postId },
			data:
				type === 'like'
					? { likes: { increment: 1 } }
					: { dislikes: { increment: 1 } },
			select: { id: true, likes: true, dislikes: true },
		})

		return NextResponse.json(post)
	} catch (err) {
		console.error('Ошибка реакции:', err)
		return NextResponse.json({ error: 'DB error' }, { status: 500 })
	}
}
