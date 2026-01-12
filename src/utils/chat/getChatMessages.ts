'use server'

import prisma from '@/../lib/prisma'

export async function getChatMessages(chatId: number) {
	if (!chatId) {
		throw new Error('Chat ID is required')
	}

	try {
		const messages = await prisma.message.findMany({
			where: { chatId },
			orderBy: { createdAt: 'asc' },
			select: {
				id: true,
				text: true,
				userId: true,
				createdAt: true,
			},
		})

		return messages
	} catch (error) {
		console.error(error)
		throw new Error('Failed to fetch messages')
	}
}
