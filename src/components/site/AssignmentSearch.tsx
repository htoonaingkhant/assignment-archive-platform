'use client'

import { ArrowRight, ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useState, useTransition } from 'react'

import type { BrowseData, BrowseFilters } from '@/lib/public-data'

type SearchFormValues = {
  major: string
  q: string
  semester: string
  subject: string
  studyYear: string
  year: string
}

const toFormValues = (filters: BrowseFilters): SearchFormValues => ({
  major: filters.major ?? '',
  q: filters.query ?? '',
  semester: filters.semester ?? '',
  subject: filters.subject ?? '',
  studyYear: filters.studyYear ?? '',
  year: filters.academicYear ?? '',
})

function SelectField({
  children,
  id,
  label,
  name,
  onChange,
  value,
}: {
  children: ReactNode
  id: string
  label: string
  name: keyof SearchFormValues
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  value: string
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-[0.68rem] font-black uppercase tracking-[0.1em] text-muted-foreground"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <select className="retro-select" id={id} name={name} onChange={onChange} value={value}>
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={17}
          strokeWidth={2.5}
        />
      </div>
    </div>
  )
}

export function AssignmentSearch({ data, filters }: { data: BrowseData; filters: BrowseFilters }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState<SearchFormValues>(() => toFormValues(filters))

  const getUrl = (form: HTMLFormElement) => {
    const params = new URLSearchParams()
    const formData = new FormData(form)

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string' && value) params.set(key, value)
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const submit = (event: FormEvent<HTMLFormElement>, replace: boolean) => {
    event.preventDefault()
    const url = getUrl(event.currentTarget)
    startTransition(() => {
      if (replace) router.replace(url, { scroll: false })
      else router.push(url, { scroll: false })
    })
  }

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.currentTarget
    setValues((current) => ({ ...current, [name]: value }))
    const form = event.currentTarget.form
    if (!form) return

    const url = getUrl(form)
    startTransition(() => router.replace(url, { scroll: false }))
  }

  return (
    <form
      className="retro-outline retro-shadow mb-8 bg-paper p-3 sm:p-4"
      method="GET"
      onSubmit={(event) => submit(event, false)}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <label
            className="mb-2 block text-xs font-black uppercase tracking-[0.12em]"
            htmlFor="query"
          >
            Search the archive
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-coral"
              size={20}
              strokeWidth={2.5}
            />
            <input
              className="flex h-14 w-full rounded-md border-2 border-ink bg-paper px-3 py-2 pl-12 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-ink focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              id="query"
              name="q"
              onChange={(event) => setValues((current) => ({ ...current, q: event.target.value }))}
              placeholder="Title, subject code, or keyword…"
              value={values.q}
            />
          </div>
        </div>

        <button
          className="inline-flex h-14 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border-2 border-ink bg-primary px-4 text-sm font-black uppercase tracking-[0.04em] shadow-[3px_3px_0_var(--foreground)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)] focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-60 sm:min-w-36 sm:self-end"
          disabled={isPending}
          type="submit"
        >
          {isPending ? 'Searching…' : 'Search'} <ArrowRight size={18} />
        </button>
      </div>

      <div className="filter-drawer mt-3 border-t border-ink/15 pt-3 lg:mt-4 lg:pt-4">
        <input className="peer sr-only" id="filter-toggle" type="checkbox" />
        <label
          className="flex min-h-11 cursor-pointer items-center justify-between border border-ink/25 bg-background px-3 text-sm font-black uppercase tracking-[0.08em] lg:hidden"
          htmlFor="filter-toggle"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal size={17} /> Refine results
          </span>
          <span className="text-xs font-bold text-muted-foreground">Tap to expand</span>
        </label>
        <div className="grid max-h-0 gap-3 overflow-hidden transition-[max-height] duration-300 peer-checked:mt-3 peer-checked:max-h-[40rem] sm:grid-cols-2 lg:mt-0 lg:max-h-none lg:grid-cols-5 lg:overflow-visible">
          <SelectField
            id="filter-academic-year"
            label="Academic year"
            name="year"
            onChange={handleSelectChange}
            value={values.year}
          >
            <option value="">All academic years</option>
            {data.academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="filter-major"
            label="Major"
            name="major"
            onChange={handleSelectChange}
            value={values.major}
          >
            <option value="">All majors</option>
            {data.majors.map((major) => (
              <option key={major.id} value={major.id}>
                {major.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="filter-semester"
            label="Semester"
            name="semester"
            onChange={handleSelectChange}
            value={values.semester}
          >
            <option value="">Both semesters</option>
            <option value="first">First semester</option>
            <option value="second">Second semester</option>
          </SelectField>

          <SelectField
            id="filter-study-year"
            label="Study year"
            name="studyYear"
            onChange={handleSelectChange}
            value={values.studyYear}
          >
            <option value="">All study years</option>
            {data.studyYears.map((studyYear) => (
              <option key={studyYear.id} value={studyYear.id}>
                {studyYear.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="filter-subject"
            label="Subject"
            name="subject"
            onChange={handleSelectChange}
            value={values.subject}
          >
            <option value="">All subjects</option>
            {data.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} · {subject.name}
              </option>
            ))}
          </SelectField>
        </div>
      </div>
    </form>
  )
}
