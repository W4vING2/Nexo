'use client'

import { bar } from '@/config/bar'
import nexoStore from '@/store/nexoStore'

export default function FooterBar() {
	const { selectedPage, setSelectedPage } = nexoStore()

	return (
		<footer className='fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 h-14 sm:hidden'>
			<ul className='flex justify-around items-center h-full'>
				{bar.map(({ id, icon: Icon }) => {
					const isActive = selectedPage === id
					return (
						<li
							key={id}
							onClick={() => setSelectedPage(id)}
							className='flex items-center justify-center flex-1 h-full'
						>
							<div
								className={`p-2 rounded-full transition ${
									isActive ? 'text-white' : 'text-gray-500 hover:text-white'
								}`}
							>
								<Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
							</div>
						</li>
					)
				})}
			</ul>
		</footer>
	)
}
