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
  const { academicYear, major, semesterSubject, subject } = getAssignmentContext(assignment)
  const groups = [
    { icon: FileQuestion, items: assignment.questionImages, label: 'Question pages' },
    { icon: GraduationCap, items: assignment.answerImages, label: 'Answer pages' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Button asChild className="mb-7" size="sm" variant="ghost">
        <Link href="/">
          <ArrowLeft /> Back to library
        </Link>
      </Button>
      <header className="rounded-3xl border bg-card p-6 shadow-sm sm:p-9">
        <div className="flex flex-wrap gap-2">
          <Badge>{subject?.code ?? 'Subject'}</Badge>
          <Badge variant="secondary">
            {semesterSubject?.semester === 'second' ? 'Second semester' : 'First semester'}
          </Badge>
        </div>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
          {assignment.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{subject?.name}</p>
        <Separator className="my-6" />
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={16} /> {academicYear?.name}
          </span>
          <span className="inline-flex items-center gap-2">
            <GraduationCap size={16} /> {major?.name}
          </span>
          <span>
            {assignment.questionImages.length} question pages · {assignment.answerImages.length}{' '}
            answer pages
          </span>
        </div>
      </header>
      <div className="mt-12 space-y-16">
        {groups.map((group) => (
          <section key={group.label}>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <group.icon size={20} />
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{group.label}</h2>
                <p className="text-sm text-muted-foreground">
                  Shown in moderator-approved reading order
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {group.items.map((row, index) => {
                const image = getMediaDocument(row.image)
                if (!image) return null
                return (
                  <figure
                    className="overflow-hidden rounded-2xl border bg-card shadow-sm"
                    key={row.id ?? image.id}
                  >
                    <div className="flex items-center justify-between border-b px-4 py-3 text-sm">
                      <span className="font-medium">Page {index + 1}</span>
                      <a
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                        href={image.secureUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open full image <ExternalLink size={14} />
                      </a>
                    </div>
                    <div className="bg-muted/30 p-2 sm:p-5">
                      {/* Cloudinary serves the original worksheet without an extra Vercel image transform. */}
                      <Image
                        alt={image.alt}
                        className="mx-auto h-auto max-h-[1200px] w-auto max-w-full rounded-lg bg-white object-contain"
                        height={image.height ?? 1200}
                        src={image.secureUrl}
                        unoptimized
                        width={image.width ?? 900}
                      />
                    </div>
                    <figcaption className="border-t px-4 py-3 text-sm text-muted-foreground">
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
