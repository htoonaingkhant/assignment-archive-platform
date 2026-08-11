import type { CollectionConfig } from 'payload'

import { adminOnly, publicRead } from '@/access/roles'

export const AcademicYears: CollectionConfig = {
  slug: 'academic-years',
  admin: {
    defaultColumns: ['name', 'isActive', 'updatedAt'],
    group: 'Academic Structure',
    useAsTitle: 'name',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicRead,
    update: adminOnly,
  },
  defaultSort: '-name',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Academic year',
      required: true,
      unique: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
