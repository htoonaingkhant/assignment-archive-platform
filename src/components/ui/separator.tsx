import * as React from 'react'

import { cn } from '@/lib/utils'

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  decorative?: boolean
  orientation?: 'horizontal' | 'vertical'
}

function Separator({
  className,
  decorative = true,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  return (
    <div
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
        className,
      )}
      role={decorative ? 'none' : 'separator'}
      {...props}
    />
  )
}

export { Separator }
