import type { ButtonProps } from '@/types/button.types'

export default function Button({ text }: ButtonProps) {
	return (
		<button className='mt-2 px-6 py-2 bg-linear-to-r from-blue-500 to-purple-600 text-black font-semibold rounded-full hover:from-purple-600 hover:to-blue-500 transition w-max'>
			{text}
		</button>
	)
}
