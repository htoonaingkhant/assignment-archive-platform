import type { CollectionConfig } from 'payload'

import { adminOnly, publicRead } from '@/access/roles'

export const Subjects: CollectionConfig = {
  slug: 'subjects',
  admin: {
    defaultColumns: ['code', 'name', 'updatedAt'],
    group: 'Academic Structure',
    useAsTitle: 'code',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicRead,
    update: adminOnly,
  },
  defaultSort: 'code',
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
