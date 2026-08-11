# Assignment Archive MVP — Implementation Plan

## Summary

Build a school assignment archive with:

- Next.js + Payload CMS deployed together on Vercel
- pnpm as the package manager
- Husky Git hooks for pre-commit, commit-msg, and pre-push checks
- shadcn/ui with the reference project's Radix Vega style
- Supabase PostgreSQL for application data
- Cloudinary for assignment image files
- Payload Admin Panel for moderation and content management
- Public assignment browsing/search without login

## Product Decisions

- UI language: English
- Roles: `student`, `moderator`, `admin`
- Students can self-register with a unique username and password
- Admin creates moderator/admin accounts
- Admin performs password resets
- Students can browse assignments but cannot access `/admin`
- Moderators can create, edit, and publish assignments
- Admins can manage users, roles, academic data, and assignments
- Public assignment viewing does not require login
- Search is metadata-only; no OCR in MVP
- No reports, favorites, notifications, or saved assignments in MVP
- One approved solution set per assignment

## Academic Data Model

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

### Subject

- `name`
- `code`

The same Subject record can be connected to both semesters through `SemesterSubject`.
Semester is restricted to two values: `first` and `second`.

### Assignment

- `semesterSubject`
- `title`
- `status`: `draft` or `published`
- `createdBy`
- `publishedBy`
- ordered question image references
- ordered answer image references

Required MVP content is subject, title, question images, and answer images.

## Authentication and Permissions

- Use Payload Authentication, not Supabase Auth.
- Login uses username and password; email is not required.
- Username must be unique.
- New self-registered accounts always receive the `student` role.
- Only an admin can create or change moderator/admin accounts.
- Student: public browsing, account access, no CMS admin access.
- Moderator: manage assignments and publish content, but cannot manage staff roles.
- Admin: full access.

## Image Storage Flow

Moderator uploads from the Payload `/admin` interface.

```text
Moderator selects image
        ↓
Payload upload integration
        ↓
Cloudinary stores the actual image
        ↓
Supabase/Postgres stores URL, public ID, metadata, and display order
```

The production app must not use Vercel's local filesystem as permanent upload storage.
Cloudinary integration will be implemented behind the CMS upload interface so moderators
do not need to upload separately through the Cloudinary dashboard.

Stored image metadata should include:

- Cloudinary public ID
- secure URL
- original filename
- MIME type
- width and height
- file size
- display order
- image type: `question` or `answer`

Image ordering changes database metadata only. Media deletion is intentionally disabled in
the MVP so a CMS action cannot orphan Cloudinary assets or assignment references. A future
explicit deletion workflow must remove both sides together.

## Upload Validation

- Allowed files: images only
- Maximum file size: 5 MB per image
- Validate on the client for fast feedback
- Validate again in Payload on the server
- Do not add automatic compression in the initial version
- Moderators are responsible for compressing images before upload

## Deployment and Services

```text
Vercel
 └── Next.js + Payload CMS

Supabase
 └── PostgreSQL database

Cloudinary
 └── Assignment image storage and CDN delivery
```

Required environment variables will include:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- Cloudinary cloud name
- Cloudinary API key
- Cloudinary API secret

Secrets must remain server-side and must not be exposed through public client variables.

## Tooling and UI Conventions

- Use `pnpm` for installation, scripts, and package management.
- Use shadcn/ui with Tailwind CSS v4, neutral base colors, Lucide icons, and the aliases
  used by the reference project (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`).
- Use Next.js Server Components by default and client components only where interaction
  requires them.
- Configure Husky hooks:
  - `pre-commit`: run lint-staged
  - `commit-msg`: run commitlint
  - `pre-push`: run the production build
- Keep the project structure aligned with Next.js App Router rather than the reference
  project's Vite/React Router structure.

## Acceptance Tests

- Duplicate usernames cannot be registered.
- Student accounts cannot access `/admin`.
- Moderator can create, edit, and publish an assignment.
- Admin can manage academic data and staff accounts.
- Question and answer image groups can be reordered in CMS.
- Public users can browse and search without logging in.
- Images render in the configured order.
- Images over 5 MB are rejected by both client and Payload validation.
- Images remain available after a Vercel redeploy.
- Database stores image metadata, not image binary files.
- Media records cannot be deleted through the MVP CMS; future deletion must remove the
  Cloudinary asset and database metadata together.

## Implementation Status

Implemented in the initial codebase:

- Next.js App Router public site and Payload Admin Panel in one deployment
- Username/password Payload authentication with student, moderator, and admin roles
- Academic year, major, reusable subject, semester-subject, media, and assignment collections
- Public metadata filters and published-assignment detail pages
- Ordered question and answer image groups
- Signed browser-to-Cloudinary uploads with client and server-side 5 MB validation
- shadcn/ui, Tailwind CSS v4, pnpm, Commitlint, lint-staged, and Husky hooks

Environment-dependent completion steps:

- Add Supabase and Cloudinary credentials to `.env`
- Generate and run the initial Payload migration against the selected Supabase project
- Create the first admin account at `/admin`
- Add the same environment variables in Vercel and deploy

## Free-tier Assumptions

- Supabase is used for PostgreSQL only.
- Cloudinary is used for actual image storage and delivery.
- Cloudinary Free Plan usage is shared across storage, bandwidth, and transformations;
  usage must be monitored as the archive grows.
- The initial project targets a school MVP with moderate traffic and image volume.
