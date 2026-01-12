'use client'

import nexoStore from '@/store/nexoStore'
import { registerUser } from '@/utils/user/registerUser'
import Link from 'next/link'
import Input from '../shared/Input'

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
			name: user.name || '',
			bio: user.bio || '',
			avatarUrl: user.avatarUrl || '',
		})

		setIsLogged(true)
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 text-white px-4'>
			<form
				action={onSubmit}
				className='bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6 border border-gray-800'
			>
				<h1 className='font-extrabold text-3xl text-center mb-4'>
					Регистрация
				</h1>

				<Input name='username' type='text' placeholder='Username' />
				<Input name='email' type='email' placeholder='Email' />
				<Input name='password' type='password' placeholder='Password' />

				<button
					type='submit'
					className='bg-linear-to-r from-blue-500 to-purple-600 text-black font-semibold py-3 rounded-xl'
				>
					Зарегистрироваться
				</button>

				<p className='text-center text-gray-400 text-sm'>
					Уже есть аккаунт?{' '}
					<Link href='/login' className='text-blue-500'>
						Войти
					</Link>
				</p>
			</form>
		</div>
	)
}
