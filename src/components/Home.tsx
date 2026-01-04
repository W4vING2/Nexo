'use client'

import Post from '@/components/ui/Post'

export default function Home() {
	const posts = [
		{
			user: 'user1',
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod.',
		},
		{
			user: 'user2',
			text: 'Another example post with more text to show how it looks when it is longer.',
		},
		{ user: 'user3', text: 'Short post' },
		{
			user: 'user4',
			text: 'Here is a longer post to demonstrate height adjustment and line wrapping. It should look like a real tweet.',
		},
		{ user: 'user5', text: 'Final example post for testing.' },
	]

	return (
		<main className='min-h-screen bg-black text-white flex flex-col gap-4 py-4'>
			{posts.map((post, idx) => (
				<Post key={idx} user={post.user} text={post.text} />
			))}
		</main>
	)
}
