import type { Metadata } from 'next'

import { AuthForm } from '@/components/auth/AuthForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Create account' }

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Create a student account</CardTitle>
          <CardDescription>
            Email is not required. Choose a unique username and password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="register" />
        </CardContent>
      </Card>
    </div>
  )
}
