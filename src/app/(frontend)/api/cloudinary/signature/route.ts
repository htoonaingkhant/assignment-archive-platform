import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { isStaff } from '@/access/roles'
import { createCloudinaryUploadSignature } from '@/lib/cloudinary'
import config from '@/payload.config'

export const runtime = 'nodejs'

export async function POST() {
  const payload = await getPayload({ config })
  const auth = await payload.auth({ headers: await headers() })

  if (!isStaff(auth.user)) {
    return NextResponse.json({ error: 'Moderator or admin access is required.' }, { status: 403 })
  }

  try {
    return NextResponse.json(createCloudinaryUploadSignature())
  } catch {
    return NextResponse.json({ error: 'Cloudinary is not configured.' }, { status: 503 })
  }
}
