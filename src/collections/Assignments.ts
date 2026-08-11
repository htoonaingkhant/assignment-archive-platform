import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { isStaff, staffOnly } from '@/access/roles'

const setAuditFields: CollectionBeforeChangeHook = ({ data, operation, originalDoc, req }) => {
  if (operation === 'create' && req.user?.id) {
    data.createdBy = req.user.id
  }

  if (data.status === 'published' && originalDoc?.status !== 'published' && req.user?.id) {
    data.publishedBy = req.user.id
    data.publishedAt = new Date().toISOString()
  }

  return data
}

export const Assignments: CollectionConfig = {
  slug: 'assignments',
  admin: {
    defaultColumns: ['title', 'semesterSubject', 'status', 'updatedAt'],
    group: 'Assignment Library',
    useAsTitle: 'title',
  },
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: ({ req }) => {
      if (isStaff(req.user)) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
    update: staffOnly,
  },
  hooks: {
    beforeChange: [setAuditFields],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'semesterSubject',
      type: 'relationship',
      relationTo: 'semester-subjects',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
    },
    {
      name: 'questionImages',
      type: 'array',
      admin: {
        description: 'Drag rows to arrange the question pages in reading order.',
      },
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
      minRows: 1,
      required: true,
    },
    {
      name: 'answerImages',
      type: 'array',
      admin: {
        description: 'Drag rows to arrange the answer pages in reading order.',
      },
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'media',
          required: true,
        },
      ],
      minRows: 1,
      required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      admin: { position: 'sidebar', readOnly: true },
      relationTo: 'users',
    },
    {
      name: 'publishedBy',
      type: 'relationship',
      admin: { position: 'sidebar', readOnly: true },
      relationTo: 'users',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
