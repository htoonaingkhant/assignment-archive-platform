import type { Metadata } from 'next'
import React from 'react'
import { Toaster } from 'sonner'

import { SiteHeader } from '@/components/site/SiteHeader'
import './styles.css'

const siteConfig = {
  description:
    'A searchable, moderated archive of assignment questions and verified image-based solutions. Find reviewed assignments organized by academic year, major, semester, and subject.',
  keywords: [
    'assignment archive',
    'past papers',
    'assignment solutions',
    'academic resources',
    'study materials',
    'assignment questions',
    'verified solutions',
    'university assignments',
    'college assignments',
    'exam preparation',
  ],
  name: 'Assignment Archive',
  shortDescription:
    'Find reviewed assignment questions and image-based solutions by year, major, semester, and subject.',
  tagline: 'Answers that stay findable',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    description: siteConfig.shortDescription,
    locale: 'en_US',
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: 'website',
    url: siteConfig.url,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@assignmentarchive',
    description: siteConfig.shortDescription,
    title: siteConfig.name,
  },
  verification: {
    // Add your verification tokens when available
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
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
