import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  if (!process.env.DATABASE_URL) redirect('/login')
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect('/login')

  return (
    <div className="mx-auto min-h-[calc(100vh-8rem)] max-w-3xl px-4 py-14 sm:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              <CardDescription>Your Assignment Archive account</CardDescription>
            </div>
            <Badge className="capitalize" variant="secondary">
              {user.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Assignments are public, so you can browse the entire archive without signing in.</p>
          {(user.role === 'moderator' || user.role === 'admin') && (
            <p>
              Your role can manage archive content from{' '}
              <Link className="font-medium text-primary hover:underline" href="/admin">
                the CMS dashboard
              </Link>
              .
            </p>
          )}
          <p>Password changes and resets are currently managed by an administrator.</p>
        </CardContent>
      </Card>
    </div>
  )
}
