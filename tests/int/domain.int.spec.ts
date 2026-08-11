import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'

import { getRole, isAdmin, isStaff } from '@/access/roles'
import { StudyYears } from '@/collections/StudyYears'
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
})
