import { BookOpenText } from 'lucide-react'
import Link from 'next/link'

import { AuthNav } from '@/components/site/AuthNav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2.5 font-semibold tracking-tight" href="/">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <BookOpenText size={19} strokeWidth={2.2} />
          </span>
          <span>Assignment Archive</span>
        </Link>
        <AuthNav />
      </div>
    </header>
  )
}
