import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import { isStaff } from '@/access/roles'
import config from '@/payload.config'

const mediaSchema = z.object({
  alt: z.string().trim().min(3).max(160),
  bytes: z.number().int().positive(),
  cloudinaryPublicId: z.string().min(1).max(255),
  format: z.string().min(1).max(20),
  height: z.number().int().positive(),
  mimeType: z.string().startsWith('image/'),
  originalFilename: z.string().min(1).max(255),
  secureUrl: z.string().url().startsWith('https://res.cloudinary.com/'),
  width: z.number().int().positive(),
})

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: await headers() })

  if (!isStaff(auth.user)) {
    return NextResponse.json({ error: 'Moderator or admin access is required.' }, { status: 403 })
  }

  const parsed = mediaSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid image metadata.' },
      { status: 400 },
    )
  }

  try {
    const media = await payload.create({
      collection: 'media',
      data: parsed.data,
      overrideAccess: true,
    })

    return NextResponse.json(
      { alt: media.alt, id: media.id, secureUrl: media.secureUrl },
      { status: 201 },
    )
  } catch (error) {
    payload.logger.error({ err: error }, 'Could not save assignment media')
    return NextResponse.json(
      { error: 'Could not verify or save the uploaded image.' },
      { status: 500 },
    )
  }
}
