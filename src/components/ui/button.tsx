import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md border-2 border-ink px-4 text-sm font-black uppercase tracking-[0.04em] transition-[transform,box-shadow,background-color] focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: { size: 'default', variant: 'default' },
    variants: {
      size: {
        default: 'h-11',
        icon: 'size-11',
        'icon-sm': 'size-11',
        lg: 'min-h-12 px-6',
        sm: 'min-h-11 px-3',
      },
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)]',
        ghost:
          'border-transparent bg-transparent shadow-none hover:bg-primary hover:shadow-[2px_2px_0_var(--foreground)]',
        outline:
          'bg-paper text-foreground shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5 hover:bg-orange',
        secondary:
          'bg-secondary text-secondary-foreground shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5 hover:bg-orange',
      },
    },
  },
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ asChild, className, size, variant, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ className, size, variant }))} {...props} />
}

export { buttonVariants }
