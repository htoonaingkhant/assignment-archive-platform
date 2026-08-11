'use client'

import { useField } from '@payloadcms/ui'
import { CheckCircle2, ImagePlus, Loader2, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { uploadImageToCloudinary } from '@/lib/cloudinary-upload'

type RelationshipValue = { id?: number | string; value?: number | string } | number | string

type MediaResponse = {
  alt: string
  id: number | string
  secureUrl: string
}

const getRelationshipID = (value: null | RelationshipValue | undefined) => {
  if (typeof value === 'number' || typeof value === 'string') return value
  return value?.id ?? value?.value ?? null
}

export function AssignmentImageUploader({ path }: { path: string }) {
  const imagePath = useMemo(() => path.replace(/\.directUpload$/, '.image'), [path])
  const imageField = useField<RelationshipValue>({ path: imagePath })
  const imageID = getRelationshipID(imageField.value)
  const [alt, setAlt] = useState('')
  const [preview, setPreview] = useState<MediaResponse | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!imageID || preview?.id === imageID) return

    const controller = new AbortController()
    fetch(`/api/media/${imageID}?depth=0`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) return null
        return (await response.json()) as MediaResponse
      })
      .then((media) => {
        if (!media) return
        setAlt(media.alt)
        setPreview(media)
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          toast.error('Could not load the saved image preview.')
        }
      })

    return () => controller.abort()
  }, [imageID, preview?.id])

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!alt.trim()) {
      toast.error('Add a short image description before choosing the file.')
      return
    }

    setUploading(true)
    try {
      const asset = await uploadImageToCloudinary(file)
      const mediaRequest = await fetch('/api/assignment-media', {
        body: JSON.stringify({
          alt: alt.trim(),
          bytes: asset.bytes,
          cloudinaryPublicId: asset.public_id,
          format: asset.format,
          height: asset.height,
          mimeType: `image/${asset.format === 'jpg' ? 'jpeg' : asset.format}`,
          originalFilename: asset.original_filename || file.name,
          secureUrl: asset.secure_url,
          width: asset.width,
        }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const mediaBody = (await mediaRequest.json()) as MediaResponse & { error?: string }
      if (!mediaRequest.ok) {
        throw new Error(mediaBody.error || 'Could not save the uploaded image.')
      }

      imageField.setValue(mediaBody.id)
      setPreview(mediaBody)
      toast.success('Image attached to this assignment page.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      style={{
        border: '1px dashed var(--theme-elevation-400)',
        borderRadius: 8,
        marginBottom: 16,
        padding: 16,
      }}
    >
      {imageID ? (
        <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
          {preview?.secureUrl ? (
            <Image
              alt={preview.alt}
              height={96}
              src={preview.secureUrl}
              style={{ borderRadius: 6, height: 96, objectFit: 'cover', width: 96 }}
              unoptimized
              width={96}
            />
          ) : (
            <ImagePlus aria-hidden="true" size={36} />
          )}
          <div>
            <strong style={{ alignItems: 'center', display: 'flex', gap: 7 }}>
              <CheckCircle2 aria-hidden="true" size={17} /> Image attached
            </strong>
            <p style={{ margin: '5px 0 0' }}>{preview?.alt || `Media record #${imageID}`}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <strong>Upload this page</strong>
            <p style={{ margin: '4px 0 0' }}>
              The image uploads to Cloudinary and attaches automatically. Maximum 5 MB.
            </p>
          </div>
          <label htmlFor={`${path}-alt`} style={{ display: 'grid', gap: 6 }}>
            <span>Image description</span>
            <input
              id={`${path}-alt`}
              onChange={(event) => setAlt(event.target.value)}
              placeholder="Example: Mathematics 2101 question page 1"
              type="text"
              value={alt}
            />
          </label>
          <label
            className="btn btn--style-primary btn--size-medium"
            style={{ width: 'fit-content' }}
          >
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
        </div>
      )}
    </div>
  )
}
