import type { InputProps } from '@/types/input.types'

export default function Input({ placeholder, name, type }: InputProps) {
	return (
		<input
			type={type}
			name={name}
			placeholder={placeholder}
			className='bg-gray-800 text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
			autoComplete='current-password'
		/>
	)
}
