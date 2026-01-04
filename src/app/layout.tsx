import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'Nexo',
	description: 'Social media app',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<head>
				<meta property='og:title' content='Nexo' />
				<meta property='og:description' content='Social media app' />
				<meta property='og:image' content='/favicon.png' />
				<meta property='og:type' content='website' />
				<meta property='og:url' content='https://nexo-inky.vercel.app/' />
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:title' content='Nexo' />
				<meta name='twitter:description' content='Social media app' />
				<meta name='twitter:image' content='/og-image.png' />
			</head>
			<body>{children}</body>
		</html>
	)
}
