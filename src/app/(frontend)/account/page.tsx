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
    <div className="mx-auto min-h-[calc(100vh-5rem)] max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Card className="rounded-none border-2 border-ink bg-paper shadow-[6px_6px_0_var(--foreground)]">
        <div aria-hidden="true" className="checker-strip h-3" />
        <CardHeader className="px-5 pb-5 pt-7 sm:px-8 sm:pt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-coral">
                Your profile
              </p>
              <CardTitle className="retro-display text-4xl leading-none">{user.username}</CardTitle>
              <CardDescription className="mt-2 font-medium">
                Your Assignment Archive account
              </CardDescription>
            </div>
            <Badge className="capitalize" variant="secondary">
              {user.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 text-sm font-medium text-muted-foreground sm:px-8">
          <p className="border-2 border-ink bg-primary p-4 text-foreground">
            Assignments are public, so you can browse the entire archive without signing in.
          </p>
          {(user.role === 'moderator' || user.role === 'admin') && (
            <p className="border-2 border-ink bg-orange p-4">
              Your role can manage archive content from{' '}
              <Link
                className="font-black text-foreground underline underline-offset-4"
                href="/admin"
              >
                the CMS dashboard
              </Link>
              .
            </p>
          )}
          <p className="border-2 border-ink bg-sky p-4">
            Password changes and resets are currently managed by an administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
