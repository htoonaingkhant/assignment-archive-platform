import { ArrowRight, BookMarked, Check, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { AssignmentCard } from '@/components/site/AssignmentCard'
import { AssignmentSearch } from '@/components/site/AssignmentSearch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { getBrowseData, type BrowseFilters } from '@/lib/public-data'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters: BrowseFilters = {
    academicYear: getParam(params.year),
    major: getParam(params.major),
    query: getParam(params.q),
    semester: getParam(params.semester),
    studyYear: getParam(params.studyYear),
    subject: getParam(params.subject),
  }
  const data = await getBrowseData(filters)
  const hasFilters = Object.values(filters).some(Boolean)
  const activeFilters = [
    filters.query ? `Search: ${filters.query}` : null,
    filters.academicYear
      ? data.academicYears.find((item) => String(item.id) === filters.academicYear)?.name
      : null,
    filters.major ? data.majors.find((item) => String(item.id) === filters.major)?.name : null,
    filters.semester === 'first'
      ? 'First semester'
      : filters.semester === 'second'
        ? 'Second semester'
        : null,
    filters.studyYear
      ? data.studyYears.find((item) => String(item.id) === filters.studyYear)?.name
      : null,
    filters.subject
      ? data.subjects.find((item) => String(item.id) === filters.subject)?.code
      : null,
  ].filter((value): value is string => Boolean(value))

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-ink bg-sky">
        <div aria-hidden="true" className="checker-strip absolute inset-x-0 top-0 h-4" />
        <div
          aria-hidden="true"
          className="starburst absolute -right-10 top-16 w-28 rotate-12 bg-coral sm:right-12 sm:top-20"
        />
        <div
          aria-hidden="true"
          className="starburst absolute bottom-8 left-[-2.5rem] w-28 -rotate-12 bg-orange sm:left-12"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-8">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 border-2 border-ink bg-primary px-3 py-2 text-xs font-black uppercase tracking-[0.12em] shadow-[3px_3px_0_var(--foreground)]">
              <Sparkles size={15} /> Student knowledge, archived
            </div>
            <h1 className="retro-display max-w-3xl text-[3.35rem] leading-[0.88] sm:text-7xl lg:text-8xl">
              Answers that stay findable.
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 sm:text-lg">
              Find reviewed assignment questions and image-based solutions without digging through
              old Telegram or Discord messages.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href="#library">
                  Browse the library <ArrowRight />
                </a>
              </Button>
            </div>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="retro-outline retro-shadow bg-paper p-5 sm:p-6">
              <ShieldCheck className="mb-8" size={28} />
              <p className="retro-display text-2xl">Moderator reviewed</p>
              <p className="mt-2 text-sm font-medium leading-6">
                Only published answer sets appear in the student library.
              </p>
            </div>
            <div className="retro-outline bg-coral p-5 sm:p-6">
              <BookMarked className="mb-8" size={28} />
              <p className="retro-display text-2xl">Ordered image pages</p>
              <p className="mt-2 text-sm font-medium leading-6">
                Questions and solutions stay in the intended reading order.
              </p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="checker-strip absolute inset-x-0 bottom-0 h-4" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8" id="library">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">The archive</p>
            <h2 className="retro-display mt-2 text-4xl leading-none sm:text-5xl">
              Find your assignment
            </h2>
          </div>
          <p className="border-2 border-ink bg-orange px-3 py-2 text-sm font-bold shadow-[3px_3px_0_var(--foreground)]">
            {data.assignments.length} published{' '}
            {data.assignments.length === 1 ? 'assignment' : 'assignments'}
          </p>
        </div>

        <AssignmentSearch data={data} filters={filters} key={JSON.stringify(filters)} />

        {activeFilters.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2" aria-label="Active filters">
            <span className="mr-1 text-xs font-black uppercase tracking-[0.12em]">Showing</span>
            {activeFilters.map((filter) => (
              <span
                className="inline-flex items-center gap-1 border-2 border-ink bg-primary px-2 py-1 text-xs font-bold"
                key={filter}
              >
                <Check size={13} /> {filter}
              </span>
            ))}
            <Link
              className="ml-1 text-xs font-black uppercase underline underline-offset-4"
              href="/"
            >
              Clear all
            </Link>
          </div>
        )}

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
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {data.assignments.map((assignment) => (
              <AssignmentCard assignment={assignment} key={assignment.id} />
            ))}
          </div>
        ) : (
          <div className="retro-outline bg-paper px-6 py-16 text-center shadow-[4px_4px_0_var(--foreground)]">
            <BookMarked className="mx-auto" size={38} strokeWidth={1.5} />
            <h3 className="retro-display mt-5 text-3xl">
              {hasFilters ? 'No assignments match those filters' : 'No assignments published yet'}
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-muted-foreground">
              {hasFilters
                ? 'Try removing one or more filters to broaden your search.'
                : 'A moderator can publish the first reviewed question and answer set from the CMS.'}
            </p>
            {hasFilters && (
              <Button asChild className="mt-6" variant="outline">
                <Link href="/">Clear filters</Link>
              </Button>
            )}
          </div>
        )}
      </section>
    </>
  )
}
