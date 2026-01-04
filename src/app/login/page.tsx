'use client'

import nexoStore from '@/store/nexoStore'
import autorizeUser from '@/utils/autorizeUser'
import { findUser } from '@/utils/findUser'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Login() {
	const { setIsLogged, setUser } = nexoStore()

	const onSubmit = async (formData: FormData) => {
		await autorizeUser(formData)
		setIsLogged(true)
		const user = await findUser(formData)
		setUser({
			email: formData.get('email') as string,
			bio: '',
			avatarUrl: '',
			name: user?.name as string,
			username: user?.name as string,
		})
		redirect('/')
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

				<input
					type='text'
					name='email'
					placeholder='Email'
					className='bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
				/>
				<input
					type='password'
					name='password'
					placeholder='Password'
					className='bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
				/>

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
