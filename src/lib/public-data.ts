import { getPayload } from 'payload'

import type {
  AcademicYear,
  Assignment,
  Major,
  Media,
  SemesterSubject,
  Subject,
} from '@/payload-types'
import config from '@/payload.config'

export type BrowseFilters = {
  academicYear?: string
  major?: string
  query?: string
  semester?: string
  subject?: string
}

export type BrowseData = {
  academicYears: AcademicYear[]
  assignments: Assignment[]
  available: boolean
  majors: Major[]
  subjects: Subject[]
}

export const asDocument = <T>(value: number | T | null | undefined): T | null => {
  return value && typeof value === 'object' ? value : null
}

export const getAssignmentContext = (assignment: Assignment) => {
  const semesterSubject = asDocument<SemesterSubject>(assignment.semesterSubject)
  const academicYear = asDocument<AcademicYear>(semesterSubject?.academicYear)
  const major = asDocument<Major>(semesterSubject?.major)
  const subject = asDocument<Subject>(semesterSubject?.subject)

  return { academicYear, major, semesterSubject, subject }
}

export const getMediaDocument = (value: number | Media): Media | null => {
  return asDocument<Media>(value)
}

export const getBrowseData = async (filters: BrowseFilters): Promise<BrowseData> => {
  if (!process.env.DATABASE_URL) {
    return { academicYears: [], assignments: [], available: false, majors: [], subjects: [] }
  }

  try {
    const payload = await getPayload({ config })
    const titleFilter = filters.query?.trim()

    const [academicYears, majors, subjects, assignments] = await Promise.all([
      payload.find({
        collection: 'academic-years',
        limit: 100,
        overrideAccess: false,
        sort: '-name',
      }),
      payload.find({ collection: 'majors', limit: 100, overrideAccess: false, sort: 'name' }),
      payload.find({ collection: 'subjects', limit: 250, overrideAccess: false, sort: 'code' }),
      payload.find({
        collection: 'assignments',
        depth: 4,
        limit: 100,
        overrideAccess: false,
        sort: '-publishedAt',
        where: {
          and: [
            { status: { equals: 'published' } },
            ...(titleFilter ? [{ title: { contains: titleFilter } }] : []),
          ],
        },
      }),
    ])

    const filteredAssignments = assignments.docs.filter((assignment) => {
      const context = getAssignmentContext(assignment)

      if (filters.academicYear && String(context.academicYear?.id) !== filters.academicYear) {
        return false
      }
      if (filters.major && String(context.major?.id) !== filters.major) return false
      if (filters.semester && context.semesterSubject?.semester !== filters.semester) return false
      if (filters.subject && String(context.subject?.id) !== filters.subject) return false

      if (titleFilter) {
        const haystack = [assignment.title, context.subject?.code, context.subject?.name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(titleFilter.toLowerCase())) return false
      }

      return true
    })

    return {
      academicYears: academicYears.docs,
      assignments: filteredAssignments,
      available: true,
      majors: majors.docs,
      subjects: subjects.docs,
    }
  } catch {
    return { academicYears: [], assignments: [], available: false, majors: [], subjects: [] }
  }
}

export const getPublishedAssignment = async (id: number) => {
  if (!process.env.DATABASE_URL) return null

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'assignments',
      depth: 4,
      limit: 1,
      overrideAccess: false,
      where: {
        and: [{ id: { equals: id } }, { status: { equals: 'published' } }],
      },
    })

    return result.docs[0] ?? null
  } catch {
    return null
  }
}
