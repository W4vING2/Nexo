'use client'

import nexoStore from '@/store/nexoStore'
import { updateUser } from '@/utils/updateUser'
import { useState } from 'react'

export default function ProfileEditModal() {
	const { user, setUser } = nexoStore()
	const [isOpen, setIsOpen] = useState(false)

	if (!user) return null

	const onSubmit = async (formData: FormData) => {
		const name = formData.get('name') as string
		const bio = (formData.get('bio') as string) || undefined

		try {
			const updated = await updateUser({
				email: user.email,
				name,
				bio,
			})

			setUser({
				...user,
				name: updated.name ?? '',
				bio: updated.bio ?? '',
				avatarUrl: updated.avatarUrl ?? '',
			})

			setIsOpen(false)
		} catch (err) {
			console.error('Failed to update user', err)
		}
	}

	return (
		<>
			<button
				className='border border-gray-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-700/50 transition'
				onClick={() => setIsOpen(true)}
			>
				Редактировать
			</button>

			{isOpen && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
					<div className='bg-gray-900/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4'>
						<h2 className='text-xl font-bold text-white'>
							Редактировать профиль
						</h2>

						<form
							className='flex flex-col gap-4'
							action={async (formData: FormData) => await onSubmit(formData)}
						>
							<input
								name='name'
								defaultValue={user.name}
								placeholder='Имя'
								className='bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
							/>
							<textarea
								name='bio'
								defaultValue={user.bio || ''}
								placeholder='О себе'
								className='bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none'
							/>

							<div className='flex justify-end gap-3 mt-2'>
								<button
									type='button'
									onClick={() => setIsOpen(false)}
									className='px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-700/50 transition text-sm font-medium'
								>
									Отмена
								</button>
								<button
									type='submit'
									className='px-4 py-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 text-black font-semibold hover:from-purple-600 hover:to-blue-500 transition text-sm'
								>
									Сохранить
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	)
}
