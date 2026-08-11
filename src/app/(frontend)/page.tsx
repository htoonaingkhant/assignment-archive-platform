import { ArrowRight, BookMarked, Search, ShieldCheck, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { AssignmentCard } from '@/components/site/AssignmentCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getBrowseData } from '@/lib/public-data'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>
const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters = {
    academicYear: getParam(params.year),
    major: getParam(params.major),
    query: getParam(params.q),
    semester: getParam(params.semester),
    subject: getParam(params.subject),
  }
  const data = await getBrowseData(filters)
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
          <Image
            alt=""
            className="object-cover opacity-30"
            fill
            priority
            sizes="58vw"
            src="/assignment-archive-social.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/65 to-background/10" />
        </div>
        <div className="absolute -right-24 top-14 size-80 rounded-full bg-accent/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-5" variant="secondary">
              <Sparkles /> Student knowledge, organized
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl">
              Assignment answers that don&apos;t disappear in chat history.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              Browse reviewed question and answer pages by academic year, major, semester, and
              subject—without digging through old Telegram or Discord messages.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#library">
                  Browse the library <ArrowRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Create student account</Link>
              </Button>
            </div>
          </div>
          <div className="grid content-end gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur">
              <ShieldCheck className="mb-5 text-primary" />
              <p className="font-semibold">Moderator reviewed</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Only published answer sets appear in the student library.
              </p>
            </div>
            <div className="rounded-2xl border bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/15">
              <BookMarked className="mb-5" />
              <p className="font-semibold">Ordered image pages</p>
              <p className="mt-1 text-sm leading-6 text-primary-foreground/75">
                Questions and solutions stay in the intended reading order.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="library">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">Library</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Find your assignment</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.assignments.length} published{' '}
            {data.assignments.length === 1 ? 'assignment' : 'assignments'}
          </p>
        </div>
        <form
          className="mb-8 grid gap-3 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)_auto]"
          method="GET"
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={17}
            />
            <Input
              className="pl-9"
              defaultValue={filters.query}
              name="q"
              placeholder="Title or subject…"
            />
          </div>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            defaultValue={filters.academicYear ?? ''}
            name="year"
          >
            <option value="">All years</option>
            {data.academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            defaultValue={filters.major ?? ''}
            name="major"
          >
            <option value="">All majors</option>
            {data.majors.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            defaultValue={filters.semester ?? ''}
            name="semester"
          >
            <option value="">Both semesters</option>
            <option value="first">First semester</option>
            <option value="second">Second semester</option>
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            defaultValue={filters.subject ?? ''}
            name="subject"
          >
            <option value="">All subjects</option>
            {data.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} · {subject.name}
              </option>
            ))}
          </select>
          <Button type="submit">Search</Button>
        </form>
        {!data.available && (
          <Alert className="mb-8">
            <BookMarked />
            <AlertTitle>The archive is being prepared</AlertTitle>
            <AlertDescription>
              The database is not connected yet. Once the administrator finishes setup, published
              assignments will appear here.
            </AlertDescription>
          </Alert>
        )}
        {data.assignments.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.assignments.map((assignment) => (
              <AssignmentCard assignment={assignment} key={assignment.id} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center">
            <BookMarked className="mx-auto text-muted-foreground" size={38} strokeWidth={1.5} />
            <h3 className="mt-4 text-lg font-semibold">
              {hasFilters ? 'No assignments match those filters' : 'No assignments published yet'}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {hasFilters
                ? 'Try removing one or more filters to broaden your search.'
                : 'A moderator can publish the first reviewed question and answer set from the CMS.'}
            </p>
            {hasFilters && (
              <Button asChild className="mt-5" variant="outline">
                <Link href="/">Clear filters</Link>
              </Button>
            )}
          </div>
        )}
      </section>
    </>
  )
}
