import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		domains: ['res.cloudinary.com'], // <--- добавь этот домен
	},
}

export default nextConfig
