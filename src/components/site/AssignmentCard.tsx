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
    <Card className="group overflow-hidden border-border/80 bg-card/90 py-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <Link className="block" href={`/assignments/${assignment.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {preview?.secureUrl ? (
            <Image
              alt={preview.alt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              fill
              src={preview.secureUrl}
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <FileImage size={36} strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
          <Badge className="absolute right-3 top-3 bg-background/90 text-foreground backdrop-blur">
            {semesterSubject?.semester === 'second' ? 'Second semester' : 'First semester'}
          </Badge>
        </div>
      </Link>
      <CardHeader className="space-y-3 px-5 pt-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-primary">
          <span>{subject?.code ?? 'Subject'}</span>
          <span className="text-border">/</span>
          <span>{major?.name ?? 'Major'}</span>
          <span className="text-border">/</span>
          <span>{studyYear?.name ?? 'Study year'}</span>
        </div>
        <Link href={`/assignments/${assignment.id}`}>
          <h2 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition group-hover:text-primary">
            {assignment.title}
          </h2>
        </Link>
      </CardHeader>
      <CardContent className="px-5 text-sm text-muted-foreground">
        {subject?.name ?? 'Assignment solution'}
      </CardContent>
      <CardFooter className="flex justify-between border-t px-5 py-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Layers3 size={15} /> {totalPages} pages
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-foreground">
          {academicYear?.name ?? 'Academic year'} <ArrowUpRight size={15} />
        </span>
      </CardFooter>
    </Card>
  )
}
