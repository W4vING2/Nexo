import prisma from '@/../lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const { requestId } = await req.json()

	await prisma.friendRequest.delete({
		where: { id: requestId },
	})

	return NextResponse.json({ ok: true })
}
