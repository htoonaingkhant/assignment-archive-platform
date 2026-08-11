'use client'

import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isRegister = mode === 'register'

  return (
    <form
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        const form = new FormData(event.currentTarget)
        const data = {
          password: String(form.get('password') ?? ''),
          username: String(form.get('username') ?? '').trim(),
        }

        try {
          const response = await fetch(isRegister ? '/api/auth/register' : '/api/users/login', {
            body: JSON.stringify(data),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
          })
          const body = (await response.json()) as {
            error?: string
            errors?: { message?: string }[]
          }

          if (!response.ok) {
            throw new Error(body.error || body.errors?.[0]?.message || 'Unable to continue.')
          }

          if (isRegister) router.push('/login?registered=1')
          else {
            router.push('/account')
            router.refresh()
          }
        } catch (submitError) {
          setError(submitError instanceof Error ? submitError.message : 'Unable to continue.')
        } finally {
          setLoading(false)
        }
      }}
    >
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label className="font-black uppercase tracking-[0.08em]" htmlFor="username">
          Username
        </Label>
        <Input
          autoComplete="username"
          id="username"
          maxLength={32}
          minLength={3}
          name="username"
          placeholder="e.g. aungmin23"
          required
        />
        {isRegister && (
          <p className="text-xs text-muted-foreground">
            Letters, numbers, dots, dashes and underscores.
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label className="font-black uppercase tracking-[0.08em]" htmlFor="password">
          Password
        </Label>
        <div className="relative">
          <Input
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            className="pr-11"
            id="password"
            maxLength={72}
            minLength={8}
            name="password"
            required
            type={showPassword ? 'text' : 'password'}
          />
          <button
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((value) => !value)}
            type="button"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
      <Button className="w-full" disabled={loading} size="lg" type="submit">
        {loading && <LoaderCircle className="animate-spin" />}
        {isRegister ? 'Create student account' : 'Log in'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {isRegister ? 'Already have an account?' : 'New to the archive?'}{' '}
        <Link
          className="font-black text-foreground underline decoration-coral decoration-2 underline-offset-4 hover:text-coral"
          href={isRegister ? '/login' : '/register'}
        >
          {isRegister ? 'Log in' : 'Create account'}
        </Link>
      </p>
    </form>
  )
}
