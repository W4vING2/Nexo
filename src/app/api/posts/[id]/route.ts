import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const postId = Number(params.id)

		if (!postId) {
			return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })
		}

		await prisma.post.delete({
			where: { id: postId },
		})

		return NextResponse.json({ success: true })
	} catch (err) {
		console.error('Ошибка при удалении поста:', err)
		return NextResponse.json(
			{ error: 'Failed to delete post' },
			{ status: 500 }
		)
	}
}
