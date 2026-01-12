import { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary'
	children: ReactNode
}

export default function Button({
	variant = 'primary',
	children,
	className = '',
	...props
}: ButtonProps) {
	const base =
		'mt-2 px-6 py-2 font-semibold rounded-full transition disabled:opacity-50'

	const styles =
		variant === 'primary'
			? 'bg-linear-to-r from-blue-500 to-purple-600 text-black hover:from-purple-600 hover:to-blue-500'
			: 'bg-gray-700 text-white hover:bg-gray-600'

	return (
		<button {...props} className={`${base} ${styles} ${className}`}>
			{children}
		</button>
	)
}
