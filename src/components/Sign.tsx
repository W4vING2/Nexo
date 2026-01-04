'use client'

import nexoStore from '@/store/nexoStore'
import registerUser from '@/utils/registerUser'
import Link from 'next/link'

export default function Login() {
	const { setIsLogged, setUser } = nexoStore()
	const onSubmit = async (formData: FormData) => {
		await registerUser(formData)
		setIsLogged(true)
		setUser({
			email: formData.get('email') as string,
			bio: '',
			avatarUrl: '',
			name: formData.get('username') as string,
			username: formData.get('username') as string,
		})
	}
	return (
		<div className='flex items-center justify-center h-screen bg-gray-950 text-white'>
			<form
				className='bg-black p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-5'
				action={onSubmit}
			>
				<h1 className='font-bold text-2xl'>Регистрация</h1>
				<input
					type='text'
					name='email'
					placeholder='email'
					className='border border-gray-700 p-2 rounded bg-zinc-800 text-white focus:outline-none focus:border-white'
				/>
				<input
					type='text'
					name='username'
					placeholder='username'
					className='border border-gray-700 p-2 rounded bg-zinc-800 text-white focus:outline-none focus:border-white'
				/>
				<input
					type='password'
					name='password'
					placeholder='password'
					className='border border-gray-700 p-2 rounded bg-zinc-800 text-white focus:outline-none focus:border-white'
				/>
				<button className='bg-white text-black py-2 px-4 rounded hover:bg-gray-500 hover:text-white'>
					Зарегистрироваться
				</button>
				<Link
					href='/login'
					className='text-white underline hover:text-blue-500'
				>
					есть аккаунт?
				</Link>
			</form>
		</div>
	)
}
