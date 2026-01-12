'use server'

import prisma from '@/../lib/prisma'
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function uploadAvatar(file: File, email: string): Promise<string> {
	try {
		if (!file) throw new Error('No file provided')
		if (!email) throw new Error('Email is required')

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

		return updatedUser.avatarUrl!
	} catch (err) {
		console.error('Avatar upload error:', err)
		throw new Error('Upload failed')
	}
}
