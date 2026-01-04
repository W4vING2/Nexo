'use server'

import prisma from '../../lib/prisma'

export const findUser = async (formData: FormData) => {
	const user = await prisma.user.findUnique({
		where: {
			email: formData.get('email') as string,
		},
	})
	return user
}
