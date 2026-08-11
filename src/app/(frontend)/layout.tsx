import type { Metadata } from 'next'
import React from 'react'
import { Toaster } from 'sonner'

import { SiteHeader } from '@/components/site/SiteHeader'
import './styles.css'

export const metadata: Metadata = {
  description:
    'A searchable, moderated archive of assignment questions and verified image-based solutions.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    description:
      'Find reviewed assignment questions and image-based solutions by year, major, semester, and subject.',
    images: ['/assignment-archive-social.png'],
    title: 'Assignment Archive',
    type: 'website',
  },
  title: { default: 'Assignment Archive', template: '%s · Assignment Archive' },
  twitter: {
    card: 'summary_large_image',
    images: ['/assignment-archive-social.png'],
    title: 'Assignment Archive',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t-2 border-ink bg-coral">
          <div aria-hidden="true" className="checker-strip h-3" />
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm font-bold sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>Assignment Archive · Answers that stay findable.</p>
            <p>Reviewed by moderators.</p>
          </div>
        </footer>
        <Toaster richColors />
      </body>
    </html>
  )
}
