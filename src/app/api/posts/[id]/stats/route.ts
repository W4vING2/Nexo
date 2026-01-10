import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> } // note: Promise
) {
	const { id } = await params // unwrap params
	const postId = Number(id)
	const userId = req.nextUrl.searchParams.get('userId')

	if (!postId)
		return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })

	try {
		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: {
				likes: true,
				dislikes: true,
				comments: { select: { id: true } },
				reactions: userId
					? {
							where: { userId: Number(userId) },
							select: { type: true },
					  }
					: undefined,
			},
		})

		if (!post)
			return NextResponse.json({ error: 'Post not found' }, { status: 404 })

		return NextResponse.json({
			likes: post.likes,
			dislikes: post.dislikes,
			commentsCount: post.comments.length,
			type: post.reactions?.[0]?.type || null,
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Server error' }, { status: 500 })
	}
}
