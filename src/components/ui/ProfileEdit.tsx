// ProfileEditModal.tsx
'use client'

import nexoStore from '@/store/nexoStore'
import { updateUser } from '@/utils/updateUser'
import Image from 'next/image'
import { useState } from 'react'

export default function ProfileEditModal() {
	const { user, setUser } = nexoStore()
	const [isOpen, setIsOpen] = useState(false)
	const [preview, setPreview] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	if (!user) return null

	// Превью аватарки
	const onAvatarChange = (file: File | null) => {
		if (!file) {
			setPreview(null)
			return
		}
		setPreview(URL.createObjectURL(file))
	}

	const onSubmit = async (formData: FormData) => {
		if (loading) return
		setLoading(true)

		const name = (formData.get('name') as string) || user.name
		const bio = (formData.get('bio') as string) || user.bio
		const avatar = formData.get('avatar') as File | null

		try {
			let avatarUrl = user.avatarUrl ?? undefined

			// 1️⃣ Загрузка аватарки на сервер
			if (avatar && avatar.size > 0) {
				const fd = new FormData()
				fd.append('avatar', avatar) // ⚠️ важно: поле называется avatar
				fd.append('email', user.email)

				const res = await fetch('/api/user/avatar', {
					method: 'POST',
					body: fd, // Content-Type не ставим вручную!
				})

				if (!res.ok) throw new Error('Avatar upload failed')
				const data = await res.json()
				avatarUrl = data.avatarUrl
			}

			// 2️⃣ Обновление имени и био
			const updated = await updateUser({
				email: user.email,
				name,
				bio: bio ?? undefined,
			})

			// 3️⃣ Обновление store
			setUser({
				...user,
				name: updated.name ?? name,
				bio: updated.bio ?? bio,
				avatarUrl: avatarUrl ?? user.avatarUrl ?? null,
			})

			setIsOpen(false)
			setPreview(null)
		} catch (err) {
			console.error('Failed to update profile', err)
			alert('Ошибка при обновлении профиля')
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className='border border-gray-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-700/50 transition'
			>
				Редактировать
			</button>

			{isOpen && (
				<div className='fixed inset-0 z-50 bg-black/70 flex items-center justify-center'>
					<div className='bg-gray-900 p-6 rounded-2xl w-full max-w-md flex flex-col gap-4'>
						<h2 className='text-xl font-bold'>Редактировать профиль</h2>

						<form
							action={async (formData: FormData) => await onSubmit(formData)}
							className='flex flex-col gap-4'
						>
							{/* Аватар */}
							<div className='flex items-center gap-4'>
								<div className='w-16 h-16 rounded-full overflow-hidden bg-gray-700'>
									<Image
										width={64}
										height={64}
										src={preview || user.avatarUrl || '/logo.png'}
										alt='avatar'
										className='w-full h-full object-contain'
									/>
								</div>

								<input
									type='file'
									name='avatar'
									accept='image/*'
									onChange={e => onAvatarChange(e.target.files?.[0] ?? null)}
									className='text-sm text-gray-300
                    file:mr-3 file:px-4 file:py-2
                    file:rounded-full file:border-0
                    file:bg-gray-700 file:text-white
                    hover:file:bg-gray-600'
								/>
							</div>

							{/* Имя */}
							<input
								name='name'
								defaultValue={user.name}
								placeholder='Имя'
								className='bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500'
							/>

							{/* BIO */}
							<textarea
								name='bio'
								defaultValue={user.bio || ''}
								placeholder='О себе'
								rows={3}
								className='bg-gray-800 rounded-xl px-4 py-3 border border-gray-700 resize-none focus:outline-none focus:border-blue-500'
							/>

							<div className='flex justify-end gap-3 mt-2'>
								<button
									type='button'
									onClick={() => {
										setIsOpen(false)
										setPreview(null)
									}}
									className='px-4 py-2 rounded-full border border-gray-600 hover:bg-gray-700/50'
								>
									Отмена
								</button>

								<button
									type='submit'
									disabled={loading}
									className='px-4 py-2 rounded-full bg-blue-600 font-semibold disabled:opacity-50'
								>
									{loading ? 'Сохранение...' : 'Сохранить'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	)
}
