import BackButton from '@/components/ui/BackButton'
import Button from '@/components/ui/Button'
import Post from '@/components/ui/Post'
import type { PageProps } from '@/types/post.types'
import getAll from '@/utils/user/getAll'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function UserProfilePage({ params }: PageProps) {
	const { username } = await params

	const user = await getAll(username)
	if (!user) notFound()

	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white'>
			<div className='max-w-xl mx-auto px-4 py-10 flex flex-col items-center gap-4'>
				<div className='w-24 h-24 rounded-full bg-gray-700 overflow-hidden'>
					<Image
						src={user.avatarUrl || '/logo.png'}
						alt='avatar'
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

				<Button text='Написать' />
			</div>

			<div className='max-w-xl mx-auto px-4 py-4 flex flex-col gap-4'>
				<h2 className='text-lg font-bold mb-2'>Посты пользователя</h2>

				{user.posts.length === 0 ? (
					<p className='text-gray-400 text-sm'>Постов пока нет</p>
				) : (
					user.posts.map(post => (
						<Post
							key={post.id}
							id={post.id}
							user={user.username || 'Неизвестный'}
							text={post.content}
							likes={post.likes}
							dislikes={post.dislikes}
							createdAt={post.createdAt.toISOString()}
						/>
					))
				)}
			</div>
		</div>
	)
}
