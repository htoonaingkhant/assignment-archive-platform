import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { adminOnly, publicRead } from '@/access/roles'

const getRelationshipID = (value: unknown) => {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    return (value as { id: number | string }).id
  }
  return null
}

const setDisplayName: CollectionBeforeChangeHook = async ({ data, req }) => {
  const academicYearID = getRelationshipID(data.academicYear)
  const majorID = getRelationshipID(data.major)
  const subjectID = getRelationshipID(data.subject)

  if (!academicYearID || !majorID || !subjectID || !data.semester) return data

  const [academicYear, major, subject] = await Promise.all([
    req.payload.findByID({ collection: 'academic-years', id: academicYearID, req }),
    req.payload.findByID({ collection: 'majors', id: majorID, req }),
    req.payload.findByID({ collection: 'subjects', id: subjectID, req }),
  ])

  data.displayName = `${academicYear.name} · ${major.name} · ${data.semester === 'first' ? 'First' : 'Second'} · ${subject.code}`

  return data
}

export const SemesterSubjects: CollectionConfig = {
  slug: 'semester-subjects',
  admin: {
    defaultColumns: ['displayName', 'semester', 'updatedAt'],
    group: 'Academic Structure',
    useAsTitle: 'displayName',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicRead,
    update: adminOnly,
  },
  indexes: [
    {
      fields: ['academicYear', 'major', 'semester', 'subject'],
      unique: true,
    },
  ],
  hooks: {
    beforeChange: [setDisplayName],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'academicYear',
      type: 'relationship',
      relationTo: 'academic-years',
      required: true,
    },
    {
      name: 'major',
      type: 'relationship',
      relationTo: 'majors',
      required: true,
    },
    {
      name: 'semester',
      type: 'select',
      options: [
        { label: 'First Semester', value: 'first' },
        { label: 'Second Semester', value: 'second' },
      ],
      required: true,
    },
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
    },
  ],
}
