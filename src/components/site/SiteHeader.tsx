import { BookOpenText, Search } from 'lucide-react'
import Link from 'next/link'

import { AuthNav } from '@/components/site/AuthNav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 shadow-[0_3px_0_var(--foreground)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-2.5" href="/">
          <span className="flex size-10 shrink-0 items-center justify-center border-2 border-ink bg-primary shadow-[3px_3px_0_var(--foreground)]">
            <BookOpenText size={20} strokeWidth={2.4} />
          </span>
          <span className="retro-display truncate text-xl leading-none sm:text-2xl">
            Assignment Archive
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            aria-label="Search assignments"
            className="flex size-11 items-center justify-center border-2 border-ink bg-orange shadow-[3px_3px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 lg:hidden"
            href="/#library"
          >
            <Search size={19} strokeWidth={2.5} />
          </Link>
          <AuthNav />
        </div>
      </div>
    </header>
  )
}
