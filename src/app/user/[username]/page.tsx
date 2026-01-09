// app/user/[username]/page.tsx
import { UserProfileClient } from '@/components/ui/UserProfile'
import getAll from '@/utils/user/getAll'
import { notFound } from 'next/navigation'

interface PageProps {
	params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
	// распаковываем Promise
	const resolvedParams = await params
	const username = resolvedParams.username

	if (!username) notFound()

	// получаем данные пользователя
	const user = await getAll(username)
	if (!user) notFound()

	// вставляем клиентский компонент
	return <UserProfileClient user={user} />
}
