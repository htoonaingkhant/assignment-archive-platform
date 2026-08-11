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
      admin: {
        description:
          'The calendar-based school period only, for example 2026–2027. First Year and Second Year are selected later in Semester Subjects.',
        placeholder: '2026–2027',
      },
      label: 'Academic year period',
      required: true,
      unique: true,
      validate: (value: null | string | undefined) => {
        if (typeof value !== 'string') return 'Enter an academic year such as 2026–2027.'
        const match = value.trim().match(/^(\d{4})\s*[-–]\s*(\d{4})$/)
        if (!match) return 'Use the format 2026–2027.'
        if (Number(match[2]) !== Number(match[1]) + 1) {
          return 'The ending year must be one year after the starting year.'
        }
        return true
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
