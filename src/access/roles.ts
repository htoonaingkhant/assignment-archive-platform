import type { Access, PayloadRequest } from 'payload'

export const roles = ['student', 'moderator', 'admin'] as const

export type AppRole = (typeof roles)[number]

type UserWithRole = {
  id?: number | string
  role?: AppRole | null
}

export const getRole = (user: PayloadRequest['user']): AppRole | null => {
  return (user as UserWithRole | null)?.role ?? null
}

export const isAdmin = (user: PayloadRequest['user']) => getRole(user) === 'admin'

export const isStaff = (user: PayloadRequest['user']) => {
  const role = getRole(user)
  return role === 'admin' || role === 'moderator'
}

export const adminOnly: Access = ({ req }) => isAdmin(req.user)

export const staffOnly: Access = ({ req }) => isStaff(req.user)

export const publicRead: Access = () => true

export const ownRecordOrAdmin: Access = ({ req }) => {
  if (isAdmin(req.user)) return true
  if (!req.user?.id) return false

  return {
    id: {
      equals: req.user.id,
    },
  }
}
