import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '../../../../../apps/generated/prisma/client'

const ADMIN_EMAIL = 'danilavaganov41@gmail.com'

// Тип для поста с автором
type PostWithAuthor = Prisma.PostGetPayload<{
	select: {
		id: true
		content: true
		likes: true
		dislikes: true
		createdAt: true
		author: {
			select: {
				username: true
				avatarUrl: true
			}
		}
	}
}>

export async function DELETE(
	req: Request,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params
	const postId = Number(id)

	if (Number.isNaN(postId)) {
		return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })
	}

	const userId = Number(req.headers.get('x-user-id'))
	const userEmail = req.headers.get('x-user-email')

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { authorId: true },
		})

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		const isOwner = post.authorId === userId
		const isAdmin = userEmail === ADMIN_EMAIL

		if (!isOwner && !isAdmin) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		await prisma.post.delete({
			where: { id: postId },
		})

		return NextResponse.json({ success: true })
	} catch (err) {
		console.error(err)
		return NextResponse.json(
			{ error: 'Failed to delete post' },
			{ status: 500 }
		)
	}
}

// Новый GET-запрос
export async function GET(
	_req: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params
		const postId = Number(id)

		if (!postId) {
			return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })
		}

		const post: PostWithAuthor | null = await prisma.post.findUnique({
			where: { id: postId },
			select: {
				id: true,
				content: true,
				likes: true,
				dislikes: true,
				createdAt: true,
				author: {
					select: {
						username: true,
						avatarUrl: true,
					},
				},
			},
		})

		if (!post) {
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })
		}

		return NextResponse.json({
			id: post.id,
			user: post.author?.username ?? 'Неизвестный',
			avatar: post.author?.avatarUrl ?? null,
			text: post.content,
			likes: post.likes,
			dislikes: post.dislikes,
			createdAt: post.createdAt.toISOString(),
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
	}
}
