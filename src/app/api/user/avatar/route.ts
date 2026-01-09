// src/app/api/user/avatar/route.ts
import prisma from '@/../lib/prisma'
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: Request) {
	try {
		const formData = await req.formData()
		const file = formData.get('avatar') as File | null
		const email = formData.get('email') as string | null

		if (!file)
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		if (!email)
			return NextResponse.json({ error: 'Email is required' }, { status: 400 })

		const buffer = Buffer.from(await file.arrayBuffer())

		const uploadResult: UploadApiResponse = await new Promise(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							folder: 'avatars',
							resource_type: 'image',
							transformation: [
								{ width: 256, height: 256, crop: 'fill', gravity: 'face' },
							],
						},
						(
							error: UploadApiErrorResponse | undefined,
							result?: UploadApiResponse
						) => {
							if (error) reject(error)
							else if (result) resolve(result)
							else reject(new Error('No result from Cloudinary'))
						}
					)
					.end(buffer)
			}
		)

		const updatedUser = await prisma.user.update({
			where: { email },
			data: { avatarUrl: uploadResult.secure_url },
		})

		return NextResponse.json({ avatarUrl: updatedUser.avatarUrl })
	} catch (err) {
		console.error('Avatar upload error:', err)
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
	}
}
