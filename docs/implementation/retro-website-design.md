# Retro Mobile-First Website Design Implementation

## Status

Implemented for the public user site and authentication pages. Payload CMS admin styling,
database schema, Payload API behavior, and Cloudinary upload behavior are unchanged.

## Design Direction

- Hybrid retro archive style inspired by the supplied references.
- Warm cream paper background with a subtle grid texture.
- Near-black borders and hard offset shadows.
- Lime primary accent with orange, coral, and sky-blue secondary colors.
- CSS checkerboard strips and CSS clip-path starbursts for decoration.
- Heavy display typography with readable sans-serif body text and Myanmar fallback.
- Decorative elements are `aria-hidden` and do not contain product content.

## Responsive Behavior

Primary target viewports are 360px, 390px, and 430px phones. Tablet and desktop layouts are
supported at 768px, 1024px, and 1440px.

- Mobile header uses a compact logo, search shortcut, and account action.
- Desktop header keeps the logo and account actions in one row.
- Touch targets are at least 44px where practical.
- Assignment cards use one column on mobile and responsive grids at larger widths.
- Assignment detail pages use a vertical question-page then answer-page reader.
- Images keep their stored order and can be opened at the original Cloudinary URL.
- Input and select focus states do not render an external outline/ring; buttons, links, and
  keyboard-interactive controls retain visible focus treatment.
- Reduced-motion users receive minimal transitions and animations.

## Search and Filter Interaction

Implementation: `src/components/site/AssignmentSearch.tsx`

- Search input and Search button are equal-height primary controls.
- Search submission uses Next.js client-side navigation, so the browser document does not
  fully reload.
- Search query remains in the URL as `q` and can be shared or revisited with browser history.
- Select filters apply immediately on change through client-side `router.replace`.
- Existing query names remain unchanged:
  - `q`
  - `year`
  - `major`
  - `semester`
  - `studyYear`
  - `subject`
- Mobile filters are collapsed behind the `Refine results` control.
- Desktop filters are visible in a five-column row.
- Active filters are displayed as chips with a `Clear all` link.
- Search button displays a pending `Searching…` state during navigation.

## Authentication UI Behavior

- The homepage hero only contains the `Browse the library` CTA; the `Create student account`
  hero CTA was removed.
- Login, register, and account pages use the same retro card, border, and shadow system.
- `AuthNav` refetches `/api/users/me` whenever the pathname changes. After login navigation,
  the header therefore updates to the username/account action without a manual reload.
- Logout clears the local header state and returns to the homepage.

## Main Frontend Files

- `src/app/(frontend)/styles.css` — theme tokens, retro utilities, focus behavior, and responsive styles
- `src/components/site/SiteHeader.tsx` — compact responsive header
- `src/components/site/AuthNav.tsx` — login/account/logout state
- `src/components/site/AssignmentSearch.tsx` — client-side search and auto-filter behavior
- `src/components/site/AssignmentCard.tsx` — responsive retro assignment cards
- `src/app/(frontend)/page.tsx` — hero, library, active filters, and result layout
- `src/app/(frontend)/assignments/[id]/page.tsx` — vertical assignment reader
- `src/app/(frontend)/login/page.tsx` — login page
- `src/app/(frontend)/register/page.tsx` — registration page
- `src/app/(frontend)/account/page.tsx` — account page

## Verification

- `pnpm lint` passes.
- `pnpm test:int` passes with 4 tests.
- `pnpm build` passes.
- Frontend Playwright tests pass with 3 tests:
  - public archive renders
  - 390px mobile layout has no horizontal overflow
  - select auto-filter and search submit do not create a document refresh
