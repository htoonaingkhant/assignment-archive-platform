import { ArrowLeft, CalendarDays, ExternalLink, FileQuestion, GraduationCap } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getAssignmentContext, getMediaDocument, getPublishedAssignment } from '@/lib/public-data'

export const dynamic = 'force-dynamic'
type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const assignment = await getPublishedAssignment(Number(id))
  return { title: assignment?.title ?? 'Assignment' }
}

export default async function AssignmentPage({ params }: PageProps) {
  const { id } = await params
  const assignment = await getPublishedAssignment(Number(id))
  if (!assignment) notFound()
  const { academicYear, major, semesterSubject, studyYear, subject } =
    getAssignmentContext(assignment)
  const groups = [
    { icon: FileQuestion, items: assignment.questionImages, label: 'Question pages' },
    { icon: GraduationCap, items: assignment.answerImages, label: 'Answer pages' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Button asChild className="mb-7" size="sm" variant="outline">
        <Link href="/">
          <ArrowLeft /> Back to library
        </Link>
      </Button>
      <header className="relative overflow-hidden border-2 border-ink bg-paper p-5 shadow-[5px_5px_0_var(--foreground)] sm:p-9">
        <div aria-hidden="true" className="checker-strip absolute inset-x-0 top-0 h-3" />
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary">{subject?.code ?? 'Subject'}</Badge>
          <Badge className="bg-orange" variant="secondary">
            {semesterSubject?.semester === 'second' ? 'Second semester' : 'First semester'}
          </Badge>
          <Badge variant="outline">{studyYear?.name ?? 'Study year'}</Badge>
        </div>
        <h1 className="retro-display mt-6 max-w-4xl text-balance text-4xl leading-[0.95] sm:text-6xl">
          {assignment.title}
        </h1>
        <p className="mt-4 text-base font-medium text-muted-foreground sm:text-lg">
          {subject?.name}
        </p>
        <Separator className="my-6 bg-ink" />
        <div className="grid gap-3 text-sm font-medium sm:grid-cols-3">
          <span className="inline-flex items-center gap-2 border-2 border-ink bg-sky px-3 py-2">
            <CalendarDays size={16} /> <span>{academicYear?.name}</span>
          </span>
          <span className="inline-flex items-center gap-2 border-2 border-ink bg-orange px-3 py-2">
            <GraduationCap size={16} />{' '}
            <span>
              {studyYear?.name ?? 'Study year'} · {major?.name}
            </span>
          </span>
          <span className="border-2 border-ink bg-primary px-3 py-2">
            {assignment.questionImages.length} question pages · {assignment.answerImages.length}{' '}
            answer pages
          </span>
        </div>
      </header>
      <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
        {groups.map((group) => (
          <section key={group.label}>
            <div className="mb-6 flex items-center gap-3 border-b-2 border-ink pb-4">
              <span className="flex size-11 shrink-0 items-center justify-center border-2 border-ink bg-coral text-ink shadow-[3px_3px_0_var(--foreground)]">
                <group.icon size={20} />
              </span>
              <div>
                <h2 className="retro-display text-3xl leading-none sm:text-4xl">{group.label}</h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Shown in moderator-approved reading order
                </p>
              </div>
            </div>
            <div className="space-y-8 sm:space-y-10">
              {group.items.map((row, index) => {
                const image = getMediaDocument(row.image)
                if (!image) return null
                return (
                  <figure
                    className="overflow-hidden border-2 border-ink bg-paper shadow-[5px_5px_0_var(--foreground)]"
                    key={row.id ?? image.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-4 py-3 text-sm">
                      <span className="font-black uppercase tracking-[0.08em]">
                        {group.label.replace(' pages', '')} · Page {index + 1}
                      </span>
                      <a
                        className="inline-flex min-h-11 items-center gap-1.5 border-2 border-ink bg-orange px-3 text-xs font-black uppercase tracking-[0.06em] shadow-[2px_2px_0_var(--foreground)] hover:bg-primary"
                        href={image.secureUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open full image <ExternalLink size={14} />
                      </a>
                    </div>
                    <div className="bg-sky/50 p-2 sm:p-5">
                      {/* Cloudinary serves the original worksheet without an extra Vercel image transform. */}
                      <Image
                        alt={image.alt}
                        className="mx-auto h-auto max-h-[1400px] w-auto max-w-full border-2 border-ink bg-white object-contain"
                        height={image.height ?? 1200}
                        src={image.secureUrl}
                        unoptimized
                        width={image.width ?? 900}
                      />
                    </div>
                    <figcaption className="border-t-2 border-ink px-4 py-3 text-sm font-medium text-muted-foreground">
                      {image.alt}
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
