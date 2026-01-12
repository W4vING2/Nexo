import Post from '@/components/Post'
import { getById } from '@/utils/post/getById'
import { notFound, redirect } from 'next/navigation'

export default async function PostPage({ params }: { params: { id: string } }) {
	const postId = Number(params.id)

	if (isNaN(postId)) {
		notFound()
	}

	const postData = await getById(postId)

	async function handleDelete() {
		'use server'
		redirect('/')
	}

	return (
		<div className='min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white pt-20 pb-14'>
			<div className='max-w-2xl mx-auto px-4'>
				<Post
					id={postData.id}
					authorId={postData.authorId}
					user={postData.user}
					avatar={postData.avatar || undefined}
					text={postData.text}
					likes={postData.likes}
					dislikes={postData.dislikes}
					createdAt={postData.createdAt}
					onDelete={handleDelete}
					image={postData.avatar}
				/>
			</div>
		</div>
	)
}
