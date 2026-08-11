'use client'

import { LogOut, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

type CurrentUser = {
  id: number
  role: 'student' | 'moderator' | 'admin'
  username: string
}

export function AuthNav() {
  const router = useRouter()
  const [user, setUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return null
        const body = (await response.json()) as { user?: CurrentUser | null }
        return body.user ?? null
      })
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  if (!user) {
    return (
      <nav className="flex items-center gap-2" aria-label="Account navigation">
        <Button asChild size="sm" variant="ghost">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">Create account</Link>
        </Button>
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-2" aria-label="Account navigation">
      <Button asChild size="sm" variant="ghost">
        <Link href="/account">
          <UserRound />
          <span className="hidden sm:inline">{user.username}</span>
        </Link>
      </Button>
      <Button
        aria-label="Log out"
        onClick={async () => {
          await fetch('/api/users/logout', { credentials: 'include', method: 'POST' })
          setUser(null)
          router.push('/')
          router.refresh()
        }}
        size="icon-sm"
        variant="outline"
      >
        <LogOut />
      </Button>
    </nav>
  )
}
