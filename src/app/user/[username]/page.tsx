import UserProfileClient from '@/components/ui/UserProfile'
import getAll from '@/utils/user/getAll'
import { notFound } from 'next/navigation'

interface PageProps {
	params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
	const resolvedParams = await params
	const username = resolvedParams.username

	if (!username) notFound()

	const user = await getAll(username)
	if (!user) notFound()

	return <UserProfileClient user={user} />
}
