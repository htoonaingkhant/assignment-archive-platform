import type { CollectionBeforeChangeHook, CollectionConfig, PayloadRequest } from 'payload'

import { isAdmin, ownRecordOrAdmin } from '@/access/roles'

const hasNoUsers = async (req: PayloadRequest) => {
  const result = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
    req,
  })

  return result.totalDocs === 0
}

const enforceRole: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  if (operation === 'create') {
    if (await hasNoUsers(req)) {
      data.role = 'admin'
    } else if (!isAdmin(req.user)) {
      data.role = 'student'
    }
  }

  if (operation === 'update' && !isAdmin(req.user)) {
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
    admin: async ({ req }) =>
      isAdmin(req.user) || req.user?.role === 'moderator' || (await hasNoUsers(req)),
    create: async ({ req }) => isAdmin(req.user) || (await hasNoUsers(req)),
    delete: ({ req }) => isAdmin(req.user),
    read: ownRecordOrAdmin,
    update: ownRecordOrAdmin,
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
        create: async ({ req }) => isAdmin(req.user) || (await hasNoUsers(req)),
        update: ({ req }) => isAdmin(req.user),
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
