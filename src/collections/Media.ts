import { APIError, type CollectionBeforeValidateHook, type CollectionConfig } from 'payload'

import { publicRead, staffOnly } from '@/access/roles'
import { getCloudinaryImage } from '@/lib/cloudinary'
import { MAX_IMAGE_SIZE } from '@/lib/media-constants'

type MediaData = {
  alt?: string
  bytes?: number
  cloudinaryPublicId?: string
  format?: string
  height?: number
  mimeType?: string
  originalFilename?: string
  secureUrl?: string
  width?: number
}

const validateCloudinaryAsset: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  const media = data as MediaData | undefined
  const publicId = media?.cloudinaryPublicId

  if (!publicId) {
    if (operation === 'create') throw new APIError('Upload an image before saving.', 400)
    return data
  }

  if (operation === 'update' && publicId === originalDoc?.cloudinaryPublicId) return data

  const resource = await getCloudinaryImage(publicId)
  const mimeType = resource.format === 'jpg' ? 'image/jpeg' : `image/${resource.format}`

  if (resource.resource_type !== 'image' || resource.bytes > MAX_IMAGE_SIZE) {
    throw new APIError('The image must be 5 MB or smaller.', 400)
  }

  return {
    ...data,
    bytes: resource.bytes,
    format: resource.format,
    height: resource.height,
    mimeType,
    originalFilename: resource.original_filename,
    secureUrl: resource.secure_url,
    width: resource.width,
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['alt', 'originalFilename', 'bytes', 'updatedAt'],
    group: 'Assignment Library',
    useAsTitle: 'alt',
  },
  access: {
    create: staffOnly,
    delete: () => false,
    read: publicRead,
    update: staffOnly,
  },
  hooks: { beforeValidate: [validateCloudinaryAsset] },
  fields: [
    {
      name: 'cloudinaryUploader',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/CloudinaryUploader#CloudinaryUploader',
        },
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Accessible description',
      required: true,
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: { hidden: true },
      required: true,
      unique: true,
    },
    {
      name: 'secureUrl',
      type: 'text',
      admin: { hidden: true },
      required: true,
    },
    {
      name: 'originalFilename',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'mimeType',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'format',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'bytes',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'width',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'height',
      type: 'number',
      admin: { readOnly: true },
    },
  ],
}
