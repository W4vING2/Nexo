import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const { content, userId } = await req.json()
		console.log('POST /api/posts payload:', { content, userId })
		if (!content || !userId) {
			return NextResponse.json(
				{ error: 'Content and userId are required' },
				{ status: 400 }
			)
		}

		const post = await prisma.post.create({
			data: { content, authorId: userId },
			select: { id: true, content: true, createdAt: true },
		})

		console.log('Post created:', post)
		return NextResponse.json(post)
	} catch (err) {
		console.error('Ошибка при создании поста:', err)
		return NextResponse.json({ error: (err as Error).message }, { status: 500 })
	}
}

export async function GET(req: NextRequest) {
	try {
		const userId = req.nextUrl.searchParams.get('userId')
		if (!userId) return NextResponse.json({ posts: [] })

		const posts = await prisma.post.findMany({
			where: { authorId: Number(userId) },
			orderBy: { createdAt: 'desc' },
			select: { id: true, content: true, createdAt: true },
		})

		return NextResponse.json({ posts })
	} catch (err) {
		console.error(err)
		return NextResponse.json({ posts: [] }, { status: 500 })
	}
}
