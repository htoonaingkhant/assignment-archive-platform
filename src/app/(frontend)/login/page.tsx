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
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Log in with your Assignment Archive username.</CardDescription>
        </CardHeader>
        <CardContent>
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
