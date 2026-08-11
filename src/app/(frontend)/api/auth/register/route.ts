import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'

const registrationSchema = z.object({
  password: z.string().min(8).max(72),
  username: z
    .string()
    .trim()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Use letters, numbers, dots, dashes, or underscores only.'),
})

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const parsed = registrationSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid registration details.' },
      { status: 400 },
    )
  }

  const payload = await getPayload({ config })
  const userCount = await payload.count({ collection: 'users', overrideAccess: true })

  if (userCount.totalDocs === 0) {
    return NextResponse.json(
      { error: 'Create the first administrator from /admin before student registration.' },
      { status: 409 },
    )
  }

  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
    where: {
      username: {
        equals: parsed.data.username,
      },
    },
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 })
  }

  await payload.create({
    collection: 'users',
    data: {
      password: parsed.data.password,
      role: 'student',
      username: parsed.data.username,
    },
    overrideAccess: true,
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
