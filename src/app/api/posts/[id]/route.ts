import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '../../../../../apps/generated/prisma/client'

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

// DELETE остаётся как есть
export async function DELETE(
	req: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await context.params

		if (!id) {
			return NextResponse.json(
				{ error: 'Post id is required' },
				{ status: 400 }
			)
		}

		await prisma.post.delete({
			where: { id: Number(id) },
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
