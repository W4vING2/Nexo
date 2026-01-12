'use server'

import prisma from '@/../lib/prisma'

export async function sendMessage(
	chatId: number,
	userId: number,
	text: string
) {
	if (!chatId || !userId || !text) {
		throw new Error('Chat ID, User ID and text are required')
	}

	try {
		const message = await prisma.message.create({
			data: { chatId, userId, text },
			select: {
				id: true,
				text: true,
				userId: true,
				createdAt: true,
			},
		})

		return message
	} catch (error) {
		console.error(error)
		throw new Error('Failed to send message')
	}
}
