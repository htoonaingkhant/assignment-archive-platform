import type { CollectionConfig } from 'payload'

import { adminOnly, publicRead } from '@/access/roles'

export const StudyYears: CollectionConfig = {
  slug: 'study-years',
  admin: {
    defaultColumns: ['name', 'sortOrder', 'updatedAt'],
    description: 'Student levels inside a major, such as First Year, Second Year, or Honours Year.',
    group: 'Academic Structure',
    useAsTitle: 'name',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicRead,
    update: adminOnly,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        placeholder: 'First Year',
      },
      required: true,
      unique: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: {
        description: 'Controls display order. Example: First Year = 1, Second Year = 2.',
        step: 1,
      },
      label: 'Display order',
      min: 1,
      required: true,
      unique: true,
    },
  ],
}
