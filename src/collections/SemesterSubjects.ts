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
  const studyYearID = getRelationshipID(data.studyYear)
  const subjectID = getRelationshipID(data.subject)

  if (!academicYearID || !majorID || !studyYearID || !subjectID || !data.semester) return data

  const [academicYear, major, studyYear, subject] = await Promise.all([
    req.payload.findByID({ collection: 'academic-years', id: academicYearID, req }),
    req.payload.findByID({ collection: 'majors', id: majorID, req }),
    req.payload.findByID({ collection: 'study-years', id: studyYearID, req }),
    req.payload.findByID({ collection: 'subjects', id: subjectID, req }),
  ])

  data.displayName = `${academicYear.name} · ${major.name} · ${studyYear.name} · ${data.semester === 'first' ? 'First Semester' : 'Second Semester'} · ${subject.code}`

  return data
}

export const SemesterSubjects: CollectionConfig = {
  slug: 'semester-subjects',
  admin: {
    defaultColumns: ['displayName', 'studyYear', 'semester', 'updatedAt'],
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
      fields: ['academicYear', 'major', 'studyYear', 'semester', 'subject'],
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
      admin: {
        description: 'Calendar period, for example 2026–2027.',
      },
      relationTo: 'academic-years',
      required: true,
    },
    {
      name: 'major',
      type: 'relationship',
      admin: {
        description: 'Major only, for example Mathematics.',
      },
      relationTo: 'majors',
      required: true,
    },
    {
      name: 'studyYear',
      type: 'relationship',
      admin: {
        description:
          'The student level inside this major and academic year, for example First Year Mathematics.',
      },
      label: 'Study year',
      relationTo: 'study-years',
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
