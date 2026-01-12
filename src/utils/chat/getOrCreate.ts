'use server'

import prisma from '@/../lib/prisma'

// Интерфейсы для фронта/утилит
export interface ChatUser {
	userId: number
	username: string | null
	avatarUrl: string | null
}

export interface ChatMessage {
	id: number
	text: string
	createdAt: Date
	userId: number
}

export interface ChatType {
	id: number
	users: ChatUser[]
	lastMessage: ChatMessage | null
}

export async function getOrCreate(userIds: number[]): Promise<ChatType> {
	if (!Array.isArray(userIds) || userIds.length < 2) {
		throw new Error('At least 2 users required')
	}

	const sortedIds = [...userIds].sort((a, b) => a - b)

	// Ищем существующий чат с этими пользователями
	const existingChats = await prisma.chat.findMany({
		where: {
			AND: sortedIds.map(id => ({
				users: { some: { userId: id } },
			})),
		},
		include: {
			users: {
				select: {
					userId: true,
					user: { select: { username: true, avatarUrl: true } },
				},
			},
			messages: {
				take: 1,
				orderBy: { createdAt: 'desc' },
				select: { id: true, text: true, createdAt: true, userId: true },
			},
		},
	})

	// Проверяем, есть ли чат с точно такими же пользователями
	const exactChat = existingChats.find(c => {
		const ids = c.users.map(u => u.userId).sort((a, b) => a - b)
		return JSON.stringify(ids) === JSON.stringify(sortedIds)
	})

	if (exactChat) {
		const lastMsg = exactChat.messages[0] ?? null
		return {
			id: exactChat.id,
			users: exactChat.users.map(u => ({
				userId: u.userId,
				username: u.user.username ?? null,
				avatarUrl: u.user.avatarUrl ?? null,
			})),
			lastMessage: lastMsg
				? {
						id: lastMsg.id,
						text: lastMsg.text,
						createdAt: lastMsg.createdAt,
						userId: lastMsg.userId,
				  }
				: null,
		}
	}

	// Если чата нет — создаём новый
	const newChat = await prisma.chat.create({
		data: {
			users: { create: userIds.map(id => ({ userId: id })) },
		},
		include: {
			users: {
				select: {
					userId: true,
					user: { select: { username: true, avatarUrl: true } },
				},
			},
			messages: {
				take: 1,
				orderBy: { createdAt: 'desc' },
				select: { id: true, text: true, createdAt: true, userId: true },
			},
		},
	})

	const newLastMsg = newChat.messages[0] ?? null

	return {
		id: newChat.id,
		users: newChat.users.map(u => ({
			userId: u.userId,
			username: u.user.username ?? null,
			avatarUrl: u.user.avatarUrl ?? null,
		})),
		lastMessage: newLastMsg
			? {
					id: newLastMsg.id,
					text: newLastMsg.text,
					createdAt: newLastMsg.createdAt,
					userId: newLastMsg.userId,
			  }
			: null,
	}
}
