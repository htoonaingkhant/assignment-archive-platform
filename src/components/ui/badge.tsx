import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm border-2 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.08em] transition-colors',
  {
    defaultVariants: { variant: 'default' },
    variants: {
      variant: {
        default: 'border-ink bg-primary text-primary-foreground',
        outline: 'border-ink bg-transparent text-foreground',
        secondary: 'border-ink bg-secondary text-secondary-foreground',
      },
    },
  },
)

type BadgeProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
