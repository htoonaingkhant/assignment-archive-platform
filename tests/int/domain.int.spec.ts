import { APIError, type PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { getRole, isAdmin, isStaff } from '@/access/roles'
import { SemesterSubjects } from '@/collections/SemesterSubjects'
import { StudyYears } from '@/collections/StudyYears'
import { Subjects } from '@/collections/Subjects'
import { MAX_IMAGE_SIZE } from '@/lib/media-constants'

const userWithRole = (role: 'student' | 'moderator' | 'admin') => {
  return { id: 1, role } as unknown as PayloadRequest['user']
}

describe('assignment archive domain rules', () => {
  it('recognizes the three supported roles', () => {
    expect(getRole(userWithRole('student'))).toBe('student')
    expect(getRole(userWithRole('moderator'))).toBe('moderator')
    expect(getRole(userWithRole('admin'))).toBe('admin')
  })

  it('allows only moderators and admins through staff checks', () => {
    expect(isStaff(userWithRole('student'))).toBe(false)
    expect(isStaff(userWithRole('moderator'))).toBe(true)
    expect(isStaff(userWithRole('admin'))).toBe(true)
    expect(isAdmin(userWithRole('moderator'))).toBe(false)
    expect(isAdmin(userWithRole('admin'))).toBe(true)
  })

  it('uses a five-megabyte image limit', () => {
    expect(MAX_IMAGE_SIZE).toBe(5 * 1024 * 1024)
  })

  it('manages study years as their own collection', () => {
    expect(StudyYears.slug).toBe('study-years')
    expect(StudyYears.admin?.useAsTitle).toBe('name')
  })

  it('returns a public conflict instead of deleting a subject that is in use', async () => {
    const beforeDelete = Subjects.hooks?.beforeDelete?.[0]
    const req = {
      payload: {
        count: vi.fn().mockResolvedValue({ totalDocs: 1 }),
      },
    } as unknown as PayloadRequest

    await expect(beforeDelete?.({ id: 1, req } as never)).rejects.toMatchObject({
      isPublic: true,
      message:
        'This subject is used by 1 semester subject. Delete those semester-subject records first.',
      status: 409,
    } satisfies Partial<APIError>)
  })

  it('returns a public conflict instead of deleting a semester subject that is in use', async () => {
    const beforeDelete = SemesterSubjects.hooks?.beforeDelete?.[0]
    const req = {
      payload: {
        count: vi.fn().mockResolvedValue({ totalDocs: 2 }),
      },
    } as unknown as PayloadRequest

    await expect(beforeDelete?.({ id: 1, req } as never)).rejects.toMatchObject({
      isPublic: true,
      message: 'This semester subject is used by 2 assignments. Delete those assignments first.',
      status: 409,
    } satisfies Partial<APIError>)
  })
})
