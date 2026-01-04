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
		<div className='flex items-center justify-center h-screen bg-gray-950 text-white'>
			<form
				className='bg-black p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-5'
				action={onSubmit}
			>
				<h1 className='font-bold text-2xl'>Вход</h1>
				<input
					type='text'
					name='email'
					placeholder='email'
					className='border border-gray-700 p-2 rounded bg-zinc-800 text-white focus:outline-none focus:border-white'
				/>
				<input
					name='password'
					type='password'
					placeholder='password'
					className='border border-gray-700 p-2 rounded bg-zinc-800 text-white focus:outline-none focus:border-white'
				/>
				<button className='bg-white text-black py-2 px-4 rounded hover:bg-gray-500 hover:text-white'>
					Войти
				</button>
				<Link href='/' className='text-white underline hover:text-blue-500'>
					нет аккаунта?
				</Link>
			</form>
		</div>
	)
}
