import { MAX_IMAGE_SIZE } from '@/lib/media-constants'

type SignatureResponse = {
  apiKey: string
  cloudName: string
  folder: string
  signature: string
  timestamp: number
}

export type CloudinaryUploadAsset = {
  bytes: number
  format: string
  height: number
  original_filename: string
  public_id: string
  secure_url: string
  width: number
}

export const uploadImageToCloudinary = async (file: File): Promise<CloudinaryUploadAsset> => {
  if (!file.type.startsWith('image/')) throw new Error('Please select an image file.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Images must be 5 MB or smaller.')

  const signatureRequest = await fetch('/api/cloudinary/signature', {
    credentials: 'include',
    method: 'POST',
  })
  const signatureBody = (await signatureRequest.json()) as SignatureResponse & { error?: string }
  if (!signatureRequest.ok) {
    throw new Error(signatureBody.error || 'Could not authorize the upload.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', signatureBody.apiKey)
  formData.append('timestamp', String(signatureBody.timestamp))
  formData.append('signature', signatureBody.signature)
  formData.append('folder', signatureBody.folder)

  const uploadRequest = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureBody.cloudName}/image/upload`,
    { body: formData, method: 'POST' },
  )
  const uploadBody = (await uploadRequest.json()) as CloudinaryUploadAsset & {
    error?: { message?: string }
  }
  if (!uploadRequest.ok) {
    throw new Error(uploadBody.error?.message || 'Image upload failed.')
  }

  return uploadBody
}
