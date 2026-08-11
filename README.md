# Assignment Archive

A searchable, moderated school assignment archive. Students browse published question and
answer images by academic year, major, study year, semester, and subject. Moderators manage
content in Payload CMS, Supabase PostgreSQL stores application data, and Cloudinary stores files.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Payload CMS 3 with its PostgreSQL adapter and built-in authentication
- Supabase PostgreSQL (database only; Supabase Auth is not used)
- Cloudinary direct image uploads and CDN delivery
- Tailwind CSS v4 and shadcn/ui
- pnpm, Husky, lint-staged, Commitlint, Vitest, and Playwright

## Local setup

1. Install Node.js 20 or newer and pnpm.
2. Copy `.env.example` to `.env` and fill in your Supabase and Cloudinary credentials.
3. Install and start the app:

   ```bash
   pnpm install
   pnpm dev
   ```

4. Open `http://localhost:3000/admin`. The first user created there becomes the admin.
5. Create academic years, majors, study years, subjects, semester-subject links, and then
   assignments. Academic year is the calendar period (`2026–2027`). Study Years has its own CRUD,
   where `name` can be `First Year` and display order can be `1`; select that record on the
   semester-subject.
6. Add question and answer rows inside Assignment, upload each image there, and drag the rows
   into their intended reading order. Media records are created automatically.

For an optional local PostgreSQL database, run `docker compose up -d postgres` and use:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/assignment
```

## Cloudinary upload flow

The image never passes through Vercel's temporary filesystem. A moderator chooses an image in an
Assignment question or answer row, the app returns a short-lived signed upload payload, and the
browser uploads the file directly to Cloudinary. Payload verifies the asset, creates the hidden
Media record, links it to the row, and stores only its URL, public ID, dimensions, MIME type, and
byte size in PostgreSQL.

Uploads are image-only and limited to 5 MB in both the browser and Payload validation. Automatic
compression is intentionally out of scope. Media deletion is disabled in this MVP so files and
database references cannot be accidentally separated.

## Database migrations

After connecting a development Supabase database, generate and apply the initial migration:

```bash
pnpm migrate:create
pnpm migrate
```

Commit generated migrations. Never run reset/fresh migration commands against production.

## Quality checks

```bash
pnpm generate:types
pnpm generate:importmap
pnpm lint
pnpm build
pnpm test:int
pnpm test:e2e
```

The integration and browser suites require a reachable PostgreSQL test database. Browser tests
also require Playwright's Chromium binary.

## Vercel deployment

Create a Vercel project from this repository and add every value from `.env.example`. Set
`NEXT_PUBLIC_APP_URL` to the production HTTPS URL. Run the Payload migration against Supabase
before serving a schema-changing release. The public site is `/`; Payload CMS is `/admin` in the
same Next.js deployment.

Project decisions and acceptance criteria live in
[`docs/implementation/plan.md`](docs/implementation/plan.md).
