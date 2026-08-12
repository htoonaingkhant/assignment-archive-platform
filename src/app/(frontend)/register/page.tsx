import type { Metadata } from 'next'

import { AuthForm } from '@/components/auth/AuthForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Create account' }

export default function RegisterPage() {
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div
        aria-hidden="true"
        className="starburst absolute -right-8 top-24 w-24 bg-coral sm:right-16"
      />
      <Card className="relative w-full max-w-md rounded-none border-2 border-ink bg-paper shadow-[6px_6px_0_var(--foreground)]">
        <div aria-hidden="true" className="checker-strip absolute inset-x-0 top-0 h-3" />
        <CardHeader className="px-5 pb-5 pt-9 sm:px-7">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-coral">
            Join the archive
          </p>
          <CardTitle className="retro-display text-4xl leading-none">Create an account</CardTitle>
          <CardDescription className="mt-2 font-medium">
            Enter your username and password.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 sm:px-7">
          <AuthForm mode="register" />
        </CardContent>
      </Card>
    </div>
  )
}
