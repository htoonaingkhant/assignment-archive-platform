import type { CollectionBeforeChangeHook, CollectionConfig, PayloadRequest } from 'payload'

import { isAdmin } from '@/access/roles'

const hasNoUsers = async (req: PayloadRequest) => {
  const result = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
    req,
  })

  return result.totalDocs === 0
}

/**
 * Payload normally includes `role` in the authenticated user because the field is saved to JWT.
 * The database fallback also handles sessions issued before a role change or a custom auth flow
 * that returns only the base user fields.
 */
const canManageUsers = async (req: PayloadRequest) => {
  if (isAdmin(req.user)) return true
  if (!req.user?.id) return false

  try {
    const currentUser = await req.payload.findByID({
      collection: 'users',
      depth: 0,
      id: req.user.id,
      overrideAccess: true,
      req,
    })

    return isAdmin(currentUser)
  } catch {
    return false
  }
}

const enforceRole: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  const canManage = await canManageUsers(req)

  if (operation === 'create') {
    if (await hasNoUsers(req)) {
      data.role = 'admin'
    } else if (!canManage) {
      data.role = 'student'
    }
  }

  if (operation === 'update' && !canManage) {
    data.role = originalDoc?.role ?? 'student'
  }

  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    defaultColumns: ['username', 'role', 'updatedAt'],
    group: 'Access Control',
    useAsTitle: 'username',
  },
  access: {
    admin: async ({ req }) => (await canManageUsers(req)) || (await hasNoUsers(req)),
    create: async ({ req }) => (await canManageUsers(req)) || (await hasNoUsers(req)),
    delete: async ({ req }) => canManageUsers(req),
    read: async ({ req }) => canManageUsers(req),
    update: async ({ req }) => canManageUsers(req),
  },
  auth: {
    lockTime: 10 * 60 * 1000,
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: false,
    },
    maxLoginAttempts: 5,
  },
  hooks: {
    beforeChange: [enforceRole],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      access: {
        create: async ({ req }) => (await canManageUsers(req)) || (await hasNoUsers(req)),
        update: async ({ req }) => canManageUsers(req),
      },
      defaultValue: 'student',
      options: [
        { label: 'Student', value: 'student' },
        { label: 'Moderator', value: 'moderator' },
        { label: 'Admin', value: 'admin' },
      ],
      required: true,
      saveToJWT: true,
    },
  ],
}
