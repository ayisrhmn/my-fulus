# MyFulus — Implementation Plan

Personal finance tracker. Single-user for now, architected so multi-user is a
configuration change, not a rewrite. Mobile-first PWA.

## Stack (versions verified at setup, 2026-09-01)

| Concern | Choice | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.3.4 | Active LTS. Turbopack is the default bundler. |
| Language | TypeScript | 5.x | |
| Styling | Tailwind CSS | 4.3.3 | v4: configuration lives in CSS via `@theme`; there is no `tailwind.config.js`. |
| Database + Auth | Supabase (Postgres) | `@supabase/supabase-js` latest + `@supabase/ssr` 0.12.4 | `@supabase/ssr` is the official replacement for the deprecated `auth-helpers` packages. |
| PWA | Serwist (`@serwist/next`) | latest | `next-pwa` is unmaintained; Serwist is its successor and supports Next.js 16. |
| Deploy | Vercel | free tier | Set install command to `bun install`. |
| Package manager | Bun | 1.3.x | Lockfile `bun.lock`. No `package-lock.json`. |

## Project conventions

- Source under `src/`, import alias `@/*`.
- App Router: route handlers for auth callback, Server Actions for mutations.
- Supabase access split into browser client, server client, and middleware
  session refresh, per the App Router SSR pattern.
- Environment variables are supplied manually by the developer. Nothing in this
  repo generates or assumes credentials. `.env*` is gitignored.

Required environment variables (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Service role key is not required for the MVP.

## Copywriting

All user-facing copy is Bahasa Indonesia in a casual Gen-Z tone ("kamu", not
"Anda"): UI labels, buttons, empty states, errors, toasts, and the Supabase
auth emails. Code, comments, commit messages, and docs stay in English.

## Database schema (target)

Enum `transaction_type`: `income` | `expense`.

**categories**
- `id` uuid pk
- `user_id` uuid null — null means a global default category shared by all users
- `name` text
- `type` transaction_type
- `icon` text null, `color` text null
- `created_at` timestamptz default now()

**transactions**
- `id` uuid pk
- `user_id` uuid not null, fk `auth.users`
- `amount` numeric(14,2) not null, check `amount > 0`
- `type` transaction_type not null
- `category_id` uuid null, fk `categories` on delete set null
- `description` text null
- `date` date not null
- `created_at` timestamptz default now()

**Row Level Security**
- Both tables: RLS enabled.
- `transactions`: user may select/insert/update/delete only rows where
  `user_id = auth.uid()`.
- `categories`: user may select rows where `user_id = auth.uid()` or
  `user_id is null`; may insert/update/delete only rows where
  `user_id = auth.uid()` (global defaults are read-only to users).
- Default categories seeded in the migration with `user_id = null`.

The migration is delivered as a single SQL file under `supabase/migrations/`,
run manually in the Supabase SQL editor.

## MVP scope (v1)

Login via magic link · transaction CRUD · categories (default + custom) ·
dashboard totals (income, expense, current-month balance) · expense-by-category
chart · date and category filters · transaction history sorted newest first ·
dark mode.

Explicitly out of scope for v1: multi-currency, budgeting/alerts, PDF/Excel
export, recurring transactions, shared accounts, automated AI insights.

## Forms

- All forms use **react-hook-form** for validation — including the login page.
  Submit still goes through Server Actions; RHF owns client-side validation and
  field state.
- CRUD forms (transaction add/edit) render inside a **bottom sheet**, not a
  dedicated route. The `Sheet` component holds the form; the list stays mounted
  behind it.
- Date input uses **react-day-picker** (v9), not the native `<input type="date">`
  — styled to match the retro tokens. Do not ship the browser default picker.

## Phases

Each phase is one reviewable commit (or a short series). Work happens on `dev`;
the developer merges and pushes.

### Phase 0 — Project init — DONE
Scaffold Next.js 16 + TypeScript + Tailwind v4 + ESLint (`src/` dir, `@/*`
alias). `git init`, initial commit on `main`. `.claude/` and `.env*` gitignored.
Migrated the package manager from npm to Bun (`bun.lock`, no `package-lock.json`).

### Phase 1 — Supabase wiring — DONE
Installed `@supabase/supabase-js` and `@supabase/ssr`. Added:
- `src/lib/supabase/client.ts` — browser client
- `src/lib/supabase/server.ts` — server client (Server Components, Route Handlers)
- `src/lib/supabase/middleware.ts` — `updateSession` helper; also route guard
- `src/proxy.ts` — Next.js 16 renamed `middleware` to `proxy`; runs `updateSession`
- `.env.example` — required env vars

### Phase 2 — Database schema + RLS — DONE
`supabase/migrations/0001_init.sql`: `transaction_type` enum, both tables,
indexes, RLS policies, 10 default global categories. Run manually in the
Supabase SQL editor.

### Phase 3 — Magic link auth — DONE (login form rework pending, see "Forms")
- `/login` — email input, `signInWithOtp`, confirmation state.
- TODO: move the email field to react-hook-form validation.
- `/auth/callback` — `exchangeCodeForSession`, redirects to `/dashboard`.
- `src/app/(app)/layout.tsx` — protected group layout, sign-out Server Action.
- `src/app/(app)/dashboard/page.tsx` — placeholder.
- `/` redirects to `/dashboard`; proxy bounces unauthenticated users to `/login`.
- Manual step for the developer: set the Site URL / Redirect URL in the Supabase
  dashboard (Authentication > URL Configuration) to include
  `http://localhost:3000/auth/callback`.
- Manual step: the magic-link email is a Supabase default (English). Rewrite it
  in Bahasa Indonesia at Authentication > Email Templates > Magic Link. Keep the
  `{{ .ConfirmationURL }}` token. This lives in the dashboard, not the repo
  (repo-managed templates would need the Supabase CLI config, out of scope).

### Phase 4 — App shell + dark mode — DONE
- `globals.css`: color/radius tokens per `docs/DESIGN.md`, `.dark` class variant.
- `next-themes` provider, default `light` (system not followed), `ThemeToggle`
  in the header for manual light/dark.
- Mobile-first `(app)` shell: sticky header (brand, theme toggle, sign out),
  `max-w-md` main, sticky `BottomNav` (Ringkasan / Transaksi / Kategori) with
  safe-area inset.
- Primitives so far: `Button` (primary/ghost/danger), `Card`, `Fab`,
  `AmountText`. `Sheet` still to build (used by the Phase 5 form rework).
- Placeholder pages for `/transactions` and `/categories`; dashboard shows dummy
  total cards.
- Login page restyled onto the tokens.

### Phase 5 — Transaction CRUD — DONE (form rework pending, see "Forms")
- Server Actions in `transactions/actions.ts`: `saveTransaction` (insert/update),
  `deleteTransaction`; server-side validation, `revalidatePath` + redirect.
- `/transactions`: history list, newest first, `Fab` to add. `AmountText` (mono,
  signed, colored) + `formatIDR`/`formatDate` helpers.
- Category scoping relies on RLS (`getCategories` in `lib/queries.ts`).
- TODO rework: replace the `/transactions/new` and `/transactions/[id]/edit`
  routes with a `Sheet` opened from the list / `Fab`. Form uses react-hook-form
  + react-day-picker. Keep the Server Actions as the submit target. `DeleteButton`
  moves into the sheet.

### Phase 6 — Categories
List defaults plus the user's custom categories. Create/edit/delete for custom
categories only.

### Phase 7 — Dashboard
Current-month totals: income, expense, balance.

### Phase 8 — Filters
Date range (this month / last month / custom range) and category filter applied
to the history list.

### Phase 9 — Expense chart
Expense breakdown by category (bar or pie). Charting library chosen at this
phase to avoid adding a dependency early; candidates: Recharts, unovis.

### Phase 10 — PWA
Serwist setup: `app/manifest.ts`, `app/sw.ts`, placeholder icons, offline app
shell. Installable on mobile.

### Phase 11 — Deploy to Vercel
Configure env vars in Vercel, verify the production build, test PWA install on a
phone.

## Known risks

1. **Next.js 16 is very new.** Serwist supports it, but service-worker builds can
   be fragile with Turbopack. If Phase 10 fails, fall back to a webpack build for
   the service worker. Not a blocker.
2. **Magic link needs manual dashboard configuration** (Redirect URL, email
   template). Covered in Phase 3.
3. **Tailwind v4 has no JS config file.** Contributors following older tutorials
   will look for `tailwind.config.js`; theme customization is in `globals.css`.
4. **Charting library not yet pinned** — decided in Phase 9.
