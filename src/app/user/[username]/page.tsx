import prisma from '@/../lib/prisma'
import BackButton from '@/components/ui/BackButton'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
	params: Promise<{
		username: string
	}>
}

export default async function UserProfilePage({ params }: PageProps) {
	const { username } = await params

	const user = await prisma.user.findUnique({
		where: { username },
		select: {
			username: true,
			name: true,
			bio: true,
			avatarUrl: true,
		},
	})

	if (!user) {
		notFound()
	}

	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white'>
			<div className='max-w-xl mx-auto px-4 py-10 flex flex-col items-center gap-4'>
				<div className='w-24 h-24 rounded-full bg-gray-700 overflow-hidden'>
					<Image
						src={user.avatarUrl || '/logo.png'}
						alt=''
						width={96}
						height={96}
						className='w-full h-full object-cover'
						loading='eager'
					/>
				</div>

				<h1 className='text-xl font-bold'>@{user.username}</h1>
				{user.name && <p className='text-gray-400'>{user.name}</p>}
				{user.bio && (
					<p className='text-center text-gray-300 mt-2'>{user.bio}</p>
				)}

				<BackButton />

				<button className='mt-2 px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-black font-semibold rounded-full hover:from-purple-600 hover:to-blue-500 transition w-max'>
					Написать
				</button>
			</div>
		</div>
	)
}
