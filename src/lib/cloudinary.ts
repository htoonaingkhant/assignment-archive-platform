import { v2 as cloudinary } from 'cloudinary'

const CLOUDINARY_FOLDER = 'assignment-archive'

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are not configured.')
  }

  cloudinary.config({
    api_key: apiKey,
    api_secret: apiSecret,
    cloud_name: cloudName,
    secure: true,
  })

  return { apiKey, apiSecret, cloudName }
}

export const createCloudinaryUploadSignature = () => {
  const { apiKey, apiSecret, cloudName } = getCloudinaryConfig()
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { folder: CLOUDINARY_FOLDER, timestamp },
    apiSecret,
  )

  return {
    apiKey,
    cloudName,
    folder: CLOUDINARY_FOLDER,
    signature,
    timestamp,
  }
}

export const getCloudinaryImage = async (publicId: string) => {
  getCloudinaryConfig()
  return cloudinary.api.resource(publicId, { resource_type: 'image' })
}
