'use client'

import nexoStore from '@/store/nexoStore'
import { registerUser } from '@/utils/registerUser'
import Link from 'next/link'
import Input from './ui/Input'

export default function Register() {
	const { setIsLogged, setUser } = nexoStore()

	const onSubmit = async (formData: FormData) => {
		const user = await registerUser(formData)

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
			username: user.username,
			name: user.name as string,
			bio: user.bio || '',
			avatarUrl: user.avatarUrl || '',
		})

		setIsLogged(true)
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white px-4'>
			<form
				className='bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6 border border-gray-800'
				action={onSubmit}
			>
				<h1 className='font-extrabold text-3xl text-center text-white mb-4'>
					Регистрация
				</h1>

				<Input name='name' type='text' placeholder='Name' />
				<Input name='username' type='text' placeholder='Username' />
				<Input name='email' type='text' placeholder='Email' />

				<button
					type='submit'
					className='bg-linear-to-r from-blue-500 to-purple-600 text-black font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-blue-500 transition'
				>
					Зарегистрироваться
				</button>

				<p className='text-center text-gray-400 text-sm mt-2'>
					Уже есть аккаунт?{' '}
					<Link
						href='/login'
						className='text-blue-500 hover:text-blue-400 font-medium transition'
					>
						Войти
					</Link>
				</p>
			</form>
		</div>
	)
}
