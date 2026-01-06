import prisma from '@/../lib/prisma'
import BackButton from '@/components/ui/BackButton'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
	params: Promise<{
		username: string
	}>
}

interface Post {
	id: number
	content: string
	createdAt: Date
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
			posts: {
				orderBy: { createdAt: 'desc' },
				select: {
					id: true,
					content: true,
					createdAt: true,
				},
			},
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

			<div className='max-w-xl mx-auto px-4 py-4 flex flex-col gap-4'>
				<h2 className='text-lg font-bold mb-2'>Посты пользователя</h2>

				{user.posts.length === 0 ? (
					<p className='text-gray-400 text-sm'>Постов пока нет</p>
				) : (
					user.posts.map((post: Post) => (
						<div
							key={post.id}
							className='bg-gray-800/60 p-4 rounded-2xl text-sm'
						>
							<p>{post.content}</p>
							<p className='mt-2 text-xs text-gray-500'>
								{new Date(post.createdAt).toLocaleString()}
							</p>
						</div>
					))
				)}
			</div>
		</div>
	)
}
