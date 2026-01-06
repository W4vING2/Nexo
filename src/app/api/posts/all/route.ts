import prisma from '@/../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const posts = await prisma.post.findMany({
			orderBy: { createdAt: 'desc' },
			select: {
				id: true,
				content: true,
				createdAt: true,
				likes: true,
				dislikes: true,
				author: {
					select: {
						id: true,
						username: true,
						avatarUrl: true,
					},
				},
			},
		})
		return NextResponse.json({ posts })
	} catch (err) {
		console.error('GET /api/posts/all error:', err)
		return NextResponse.json({ posts: [] }, { status: 500 })
	}
}
