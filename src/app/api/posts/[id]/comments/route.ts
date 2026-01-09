import prisma from '@/../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
	_req: Request,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params
	const postId = Number(id)

	if (Number.isNaN(postId)) {
		return NextResponse.json({ error: 'Invalid postId' }, { status: 400 })
	}

	try {
		const comments = await prisma.comment.findMany({
			where: { postId },
			include: { user: { select: { username: true, avatarUrl: true } } },
			orderBy: { createdAt: 'asc' },
		})

		return NextResponse.json(
			comments.map(c => ({
				id: c.id,
				postId: c.postId,
				userId: c.userId,
				username: c.user?.username ?? 'Неизвестный',
				avatarUrl: c.user?.avatarUrl ?? '/logo.png',
				text: c.text,
				createdAt: c.createdAt.toISOString(),
			}))
		)
	} catch (err) {
		console.error(err)
		return NextResponse.json(
			{ error: 'Failed to fetch comments' },
			{ status: 500 }
		)
	}
}

export async function POST(
	req: Request,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params
	const postId = Number(id)

	if (Number.isNaN(postId)) {
		return NextResponse.json({ error: 'Invalid postId' }, { status: 400 })
	}

	const body = await req.json()
	const { userId, text } = body

	if (!userId || !text) {
		return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
	}

	try {
		const comment = await prisma.comment.create({
			data: {
				postId,
				userId,
				text,
			},
			include: {
				user: {
					select: { username: true, avatarUrl: true },
				},
			},
		})

		return NextResponse.json({
			id: comment.id,
			postId: comment.postId,
			userId: comment.userId,
			username: comment.user?.username ?? 'Неизвестный',
			avatarUrl: comment.user?.avatarUrl ?? '/logo.png',
			text: comment.text,
			createdAt: comment.createdAt.toISOString(),
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json(
			{ error: 'Failed to create comment' },
			{ status: 500 }
		)
	}
}
