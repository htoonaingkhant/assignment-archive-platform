import type { CollectionConfig } from 'payload'

import { adminOnly, publicRead } from '@/access/roles'

export const Majors: CollectionConfig = {
  slug: 'majors',
  admin: {
    defaultColumns: ['name', 'code', 'updatedAt'],
    group: 'Academic Structure',
    useAsTitle: 'name',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicRead,
    update: adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'code',
      type: 'text',
      admin: {
        description: 'Optional short code, for example MATH.',
      },
    },
  ],
}
