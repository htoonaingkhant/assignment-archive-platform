import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { Users } from '@/collections/Users'

const requestFor = (role: 'admin' | 'moderator'): PayloadRequest =>
  ({
    payload: {
      count: vi.fn().mockResolvedValue({ totalDocs: 1 }),
      findByID: vi.fn().mockResolvedValue({ id: 1, role }),
    },
    user: { id: 1, role },
  }) as unknown as PayloadRequest

const checkCollectionAccess = async (
  key: 'admin' | 'create' | 'delete' | 'read' | 'update',
  req: PayloadRequest,
) => {
  const access = Users.access?.[key]
  if (typeof access !== 'function') throw new Error(`Missing Users access rule: ${key}`)
  return access({ req })
}

describe('Users collection access', () => {
  it('allows admins to manage the user collection', async () => {
    const req = requestFor('admin')

    await expect(checkCollectionAccess('admin', req)).resolves.toBe(true)
    await expect(checkCollectionAccess('create', req)).resolves.toBe(true)
    await expect(checkCollectionAccess('read', req)).resolves.toBe(true)
    await expect(checkCollectionAccess('update', req)).resolves.toBe(true)
    await expect(checkCollectionAccess('delete', req)).resolves.toBe(true)
  })

  it('blocks moderators from the user table and user management actions', async () => {
    const req = requestFor('moderator')

    await expect(checkCollectionAccess('admin', req)).resolves.toBe(false)
    await expect(checkCollectionAccess('create', req)).resolves.toBe(false)
    await expect(checkCollectionAccess('read', req)).resolves.toBe(false)
    await expect(checkCollectionAccess('update', req)).resolves.toBe(false)
    await expect(checkCollectionAccess('delete', req)).resolves.toBe(false)
  })
})
