import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { Prisma, PrismaClient } from '../apps/generated/prisma/client'

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
	adapter,
})

const userData: Prisma.UserCreateInput[] = [
	{
		password: 'password123',
		email: 'trom-ad@example.com',
		name: 'Trom Ad',
	},
	{
		password: 'securepass456',
		email: 'user@example.com',
		name: 'User',
	},
]

export async function main() {
	for (const u of userData) {
		await prisma.user.create({ data: u })
	}
}

main()
