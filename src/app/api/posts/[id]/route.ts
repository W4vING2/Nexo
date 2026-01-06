import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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
