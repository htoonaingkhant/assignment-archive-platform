'use client'

import { useField } from '@payloadcms/ui'
import { ImagePlus, Loader2, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { toast } from 'sonner'

import { MAX_IMAGE_SIZE } from '@/lib/media-constants'

type SignatureResponse = {
  apiKey: string
  cloudName: string
  folder: string
  signature: string
  timestamp: number
}

type UploadResponse = {
  bytes: number
  format: string
  height: number
  original_filename: string
  public_id: string
  secure_url: string
  width: number
}

export function CloudinaryUploader() {
  const publicId = useField<string>({ path: 'cloudinaryPublicId' })
  const secureUrl = useField<string>({ path: 'secureUrl' })
  const originalFilename = useField<string>({ path: 'originalFilename' })
  const mimeType = useField<string>({ path: 'mimeType' })
  const format = useField<string>({ path: 'format' })
  const bytes = useField<number>({ path: 'bytes' })
  const width = useField<number>({ path: 'width' })
  const height = useField<number>({ path: 'height' })
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Images must be 5 MB or smaller.')
      return
    }

    setUploading(true)
    try {
      const signatureRequest = await fetch('/api/cloudinary/signature', { method: 'POST' })
      const signatureBody = await signatureRequest.json()
      if (!signatureRequest.ok) {
        throw new Error(signatureBody.error || 'Could not authorize the upload.')
      }
      const signature = signatureBody as SignatureResponse

      const formData = new FormData()
      formData.append('file', file)
      formData.append('api_key', signature.apiKey)
      formData.append('timestamp', String(signature.timestamp))
      formData.append('signature', signature.signature)
      formData.append('folder', signature.folder)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
        { body: formData, method: 'POST' },
      )
      const responseBody = await response.json()
      if (!response.ok) throw new Error(responseBody.error?.message || 'Image upload failed.')
      const asset = responseBody as UploadResponse

      publicId.setValue(asset.public_id)
      secureUrl.setValue(asset.secure_url)
      originalFilename.setValue(asset.original_filename || file.name)
      mimeType.setValue(`image/${asset.format === 'jpg' ? 'jpeg' : asset.format}`)
      format.setValue(asset.format)
      bytes.setValue(asset.bytes)
      width.setValue(asset.width)
      height.setValue(asset.height)
      toast.success('Image uploaded. Add alt text, then save this record.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          alignItems: 'center',
          border: '1px dashed var(--theme-elevation-400)',
          borderRadius: 8,
          display: 'flex',
          gap: 16,
          padding: 20,
        }}
      >
        {secureUrl.value ? (
          <>
            {/* Cloudinary already hosts and delivers this CMS preview. */}
            <Image
              alt="Uploaded preview"
              height={88}
              src={secureUrl.value}
              style={{ borderRadius: 6, height: 88, objectFit: 'cover', width: 88 }}
              unoptimized
              width={88}
            />
          </>
        ) : (
          <ImagePlus aria-hidden="true" size={36} />
        )}
        <div style={{ flex: 1 }}>
          <strong>{secureUrl.value ? 'Image ready' : 'Upload assignment image'}</strong>
          <p style={{ margin: '4px 0 12px' }}>Image files only. Maximum size: 5 MB.</p>
          {!secureUrl.value && (
            <label className="btn btn--style-primary btn--size-medium">
              {uploading ? (
                <Loader2 aria-hidden="true" size={16} />
              ) : (
                <UploadCloud aria-hidden="true" size={16} />
              )}
              <span>{uploading ? 'Uploading…' : 'Choose image'}</span>
              <input
                accept="image/*"
                disabled={uploading}
                hidden
                onChange={handleUpload}
                type="file"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  )
}
