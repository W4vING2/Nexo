'use client'

import Input from '@/components/ui/Input'
import nexoStore from '@/store/nexoStore'
import { authorizeUser } from '@/utils/autorizeUser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
	const { setIsLogged, setUser } = nexoStore()
	const router = useRouter()

	const onSubmit = async (formData: FormData) => {
		const user = await authorizeUser(formData)

		localStorage.setItem(
			'user',
			JSON.stringify({
				id: user.id,
				email: user.email,
				username: user.username,
				name: user.name,
				bio: user.bio || '',
				avatarUrl: user.avatarUrl || '',
			})
		)

		setUser({
			id: user.id,
			email: user.email,
			username: user.username || '',
			name: user.name as string,
			bio: user.bio || '',
			avatarUrl: user.avatarUrl || '',
		})

		setIsLogged(true)
		router.push('/')
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white px-4'>
			<form
				className='bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6 border border-gray-800'
				action={onSubmit}
			>
				<h1 className='font-extrabold text-3xl text-center text-white mb-4'>
					Вход
				</h1>

				<Input type='text' name='email' placeholder='Email' />
				<Input type='password' name='password' placeholder='Password' />

				<button
					type='submit'
					className='bg-linear-to-r from-blue-500 to-purple-600 text-black font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-blue-500 transition'
				>
					Войти
				</button>

				<p className='text-center text-gray-400 text-sm mt-2'>
					Нет аккаунта?{' '}
					<Link
						href='/'
						className='text-blue-500 hover:text-blue-400 font-medium transition'
					>
						Зарегистрироваться
					</Link>
				</p>
			</form>
		</div>
	)
}
