import prisma from '@/../lib/prisma'

export default async function getAll(username: string) {
	return await prisma.user.findUnique({
		where: { username },
		select: {
			id: true,
			username: true,
			name: true,
			bio: true,
			avatarUrl: true,
			posts: {
				orderBy: { createdAt: 'desc' },
				select: {
					id: true,
					content: true,
					createdAt: true,
					likes: true,
					dislikes: true,
				},
			},
		},
	})
}
