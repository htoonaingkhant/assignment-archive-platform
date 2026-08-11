import { CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

import { AuthForm } from '@/components/auth/AuthForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Log in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>
}) {
  const params = await searchParams
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div
        aria-hidden="true"
        className="starburst absolute -left-8 top-20 w-24 bg-orange sm:left-16"
      />
      <Card className="relative w-full max-w-md rounded-none border-2 border-ink bg-paper shadow-[6px_6px_0_var(--foreground)]">
        <div aria-hidden="true" className="checker-strip absolute inset-x-0 top-0 h-3" />
        <CardHeader className="px-5 pb-5 pt-9 sm:px-7">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-coral">
            Student access
          </p>
          <CardTitle className="retro-display text-4xl leading-none">Welcome back</CardTitle>
          <CardDescription className="mt-2 font-medium">
            Log in with your Assignment Archive username.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 sm:px-7">
          {params.registered && (
            <Alert className="mb-5">
              <CheckCircle2 />
              <AlertDescription>
                Your student account is ready. You can log in now.
              </AlertDescription>
            </Alert>
          )}
          <AuthForm mode="login" />
        </CardContent>
      </Card>
    </div>
  )
}
