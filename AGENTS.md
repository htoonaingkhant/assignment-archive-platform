# AGENTS.md — Assignment Archive

Next.js App Router + TypeScript application with Payload CMS, Supabase PostgreSQL,
Cloudinary image storage, pnpm, Husky, and shadcn/ui. The project provides a public
assignment archive and a moderated CMS for students, moderators, and admins.

# Critical Rules

## Project Guidance

- Read `docs/implementation/plan.md` before making architectural or schema changes.
- Keep this file and `docs/implementation/plan.md` updated when a project-wide decision changes.
- Prefer small, focused changes that match the existing Next.js structure.
- Do not introduce a second backend, authentication provider, or file-storage provider
  without updating the implementation plan first.
- Use `pnpm` instead of `npm` for package installation and project scripts.

## Responses and Work Style

- Keep user-facing responses concise unless more detail is requested.
- Before making a high-impact assumption, inspect the repository and existing plan first.
- Ask the user only when the decision cannot be safely inferred and would materially change
  the implementation.
- Never claim a feature works without running an appropriate verification command.

## Skills and Documentation

- Always use an available skill when the task clearly matches its description.
- Check `docs/implementation/plan.md` and relevant `docs/` files before implementing planned work.
- For current framework or service behavior, prefer official documentation.

## Change and Implementation Rules

- Use `apply_patch` for source-file edits.
- Preserve unrelated user changes in the working tree.
- Use the Next.js App Router; do not create a Pages Router structure unless explicitly required.
- Keep server-only code, secrets, and privileged integrations out of client components.
- Use Server Components by default; add `'use client'` only when browser interactivity is needed.
- Keep feature-specific code inside its feature folder and shared code in shared modules.

## Package Manager, Hooks, and UI

- Package manager: `pnpm`.
- Install dependencies with `pnpm install`.
- Use Husky for repository hooks:
  - `pre-commit`: `pnpm exec lint-staged`
  - `commit-msg`: `pnpm exec commitlint --edit "$1"`
  - `pre-push`: `pnpm build`
- Keep hook setup in `.husky/` and make the hooks executable.
- Use shadcn/ui with the reference project's `radix-vega` style, neutral base color,
  CSS variables, and Lucide icons.
- Use Tailwind CSS v4 with CSS-first configuration; do not add a legacy
  `tailwind.config.js` unless a dependency requires it.
- Keep shadcn aliases consistent with the reference project:
  `@/components`, `@/components/ui`, `@/lib`, and `@/hooks`.
- Add shadcn components through the shadcn CLI and keep generated UI components focused
  on presentation.

## Verification

After meaningful changes, run the checks available in `package.json`, at minimum:

```bash
pnpm lint
pnpm build
```

Run the test command when a test script exists. If no test runner is configured, add focused
tests when practical or clearly report that automated tests are not configured.

For UI changes, verify the relevant route in a local development server when possible.
For upload/auth/schema changes, test both the success path and the relevant permission or
validation failure path.

## Database and Schema Changes

- Payload uses Supabase PostgreSQL through the Payload Postgres adapter.
- Payload Auth is the application authentication system; Supabase Auth is not used.
- Username must be unique.
- New self-registered users must receive the `student` role server-side.
- Only admins may create or change `moderator` and `admin` roles.
- When collections or fields change, create and run the appropriate Payload database migration.
- Do not use destructive database commands against production.
- Do not manually edit the production database schema outside the migration workflow.

## Development Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm prepare
```

Use the scripts defined in `package.json` as the source of truth if they differ from these
defaults.

## Authentication and Roles

Roles are exactly:

- `student` — public browsing and account access; no CMS Admin Panel access.
- `moderator` — create, edit, and publish assignments; cannot manage staff roles.
- `admin` — full access to users, academic data, assignments, and settings.

Authentication uses username/password without requiring email. Passwords must be handled by
Payload's secure authentication implementation and must never be logged or stored in plaintext.
Password reset is admin-managed for the MVP.

## Image Upload and Storage

- Actual assignment image files belong in Cloudinary, not the Vercel local filesystem.
- Moderator uploads must go through the Payload Admin upload flow and the Cloudinary integration.
- Store Cloudinary public ID, secure URL, file metadata, image type, and display order in Payload.
- Keep question images and answer images as separate ordered groups.
- Allowed upload type is image-only.
- Maximum file size is 5 MB per image, validated on the client and again in Payload.
- Automatic compression is out of scope for the initial version; moderators compress images before upload.
- Cloudinary API secrets must remain server-side and must not use `NEXT_PUBLIC_` variables.
- Media deletion is disabled in the MVP to prevent orphaning either Cloudinary assets or
  assignment references. A future explicit deletion workflow must remove both atomically.
- Do not use local disk uploads in production because Vercel local storage is not a permanent asset store.

## Academic Data Model

The academic hierarchy is:

```text
AcademicYear
 └── Major
      └── Semester: First | Second
           └── SemesterSubject
                └── Subject
                     └── Assignment
                          ├── Question Images [ordered]
                          └── Answer Images [ordered]
```

Subject records contain `name` and `code`. A reusable Subject may be linked to both semesters
through `SemesterSubject`; do not duplicate Subject records for each semester.

Assignments contain at least:

- `semesterSubject`
- `title`
- `status` (`draft` or `published`)
- creator/publisher references
- ordered question images
- ordered answer images

Public search is metadata-based only. OCR is not part of the MVP.

## Recommended Project Structure

Use the Next.js App Router structure. Keep Payload's generated routes separate from the public
site route group:

```text
assignment/
├── src/
│   ├── app/
│   │   ├── (frontend)/             # Public user site routes
│   │   ├── (payload)/              # Payload Admin/API generated routes
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── collections/                # Payload collection configs
│   ├── access/                     # Payload access-control functions
│   ├── hooks/                      # Payload hooks
│   ├── features/
│   │   ├── assignments/
│   │   ├── academic-structure/
│   │   ├── auth/
│   │   └── media/
│   ├── components/
│   │   ├── ui/
│   │   └── common/
│   ├── lib/
│   └── providers/
├── public/
├── payload.config.ts
├── payload-types.ts                # Generated; do not hand-edit
├── components.json                 # shadcn/ui configuration
├── .husky/                         # Git hooks
├── docs/
│   └── implementation/
│       └── plan.md
├── AGENTS.md
└── package.json
```

Generated Payload files may follow the structure produced by the installed Payload version.
Do not hand-edit generated files unless the Payload documentation explicitly requires it.

## Public Site Behavior

- Public users can browse by academic year, major, semester, and subject.
- Only published assignments appear publicly.
- Assignment detail pages show question images first and answer images second.
- Images must render in their stored order.
- Public browsing does not require login.

## Out of Scope for MVP

- Automatic image compression
- OCR and image-text search
- User-submitted assignments by students
- Reports and content flagging
- Favorites, saved assignments, notifications, and activity feeds
- Email-based password recovery
- Multiple approved solution sets for one assignment

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
