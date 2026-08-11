import * as React from 'react'

import { cn } from '@/lib/utils'

export function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex min-h-12 w-full rounded-md border-2 border-ink bg-paper px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-ink focus-visible:border-ink focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
        className,
      )}
      type={type}
      {...props}
    />
  )
}
