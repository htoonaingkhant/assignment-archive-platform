import { ArrowUpRight, FileImage, Layers3 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getAssignmentContext, getMediaDocument } from '@/lib/public-data'
import type { Assignment } from '@/payload-types'

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const { academicYear, major, semesterSubject, studyYear, subject } =
    getAssignmentContext(assignment)
  const preview = getMediaDocument(assignment.questionImages[0]?.image)
  const totalPages = assignment.questionImages.length + assignment.answerImages.length

  return (
    <Card className="group overflow-hidden rounded-none border-2 border-ink bg-paper py-0 shadow-[5px_5px_0_var(--foreground)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[7px_7px_0_var(--foreground)] motion-reduce:transform-none">
      <Link className="block" href={`/assignments/${assignment.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink bg-sky">
          {preview?.secureUrl ? (
            <Image
              alt={preview.alt}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
              fill
              src={preview.secureUrl}
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink">
              <FileImage size={36} strokeWidth={1.5} />
            </div>
          )}
          <div aria-hidden="true" className="absolute bottom-3 left-3 h-3 w-16 bg-coral" />
          <Badge className="absolute right-3 top-3 bg-paper">
            {semesterSubject?.semester === 'second' ? 'Second semester' : 'First semester'}
          </Badge>
        </div>
      </Link>
      <CardHeader className="space-y-3 px-5 pt-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-black uppercase tracking-[0.1em] text-coral">
          <span>{subject?.code ?? 'Subject'}</span>
          <span className="text-ink">/</span>
          <span>{major?.name ?? 'Major'}</span>
          <span className="text-ink">/</span>
          <span>{studyYear?.name ?? 'Study year'}</span>
        </div>
        <Link href={`/assignments/${assignment.id}`}>
          <h2 className="line-clamp-2 text-xl font-black leading-snug tracking-tight transition group-hover:text-coral">
            {assignment.title}
          </h2>
        </Link>
      </CardHeader>
      <CardContent className="px-5 text-sm font-medium text-muted-foreground">
        {subject?.name ?? 'Assignment solution'}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2 border-t-2 border-ink px-5 py-4 text-xs font-bold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.06em]">
          <Layers3 size={15} /> {totalPages} pages
        </span>
        <span className="inline-flex items-center gap-1 font-black text-foreground">
          {academicYear?.name ?? 'Academic year'} <ArrowUpRight size={15} />
        </span>
      </CardFooter>
    </Card>
  )
}
