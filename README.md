# MyFulus

Personal finance tracker — a mobile-first PWA for logging income and expenses,
seeing a monthly summary, and breaking spending down by category. Built for
personal use, but the data model is multi-user ready.

## Stack

- **Next.js 16** (App Router, `src/`, `@/*` alias) + **TypeScript**
- **Tailwind CSS v4** — theme tokens in `src/app/globals.css` (`@theme`), no JS config
- **Supabase** — Postgres + Auth (magic link), via `@supabase/ssr`
- **Serwist** (`@serwist/next`) — service worker / installable PWA
- Forms: **react-hook-form**, **Radix UI** (Select / Dialog / Popover),
  **react-day-picker**, **sonner** toasts
- **Bun** package manager · deploy target **Vercel**

## Setup

```bash
bun install
cp .env.example .env        # then fill in the Supabase values
```

`.env` needs:

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same page (`anon` / `public` key) |
| `NEXT_PUBLIC_SITE_URL` | optional; your public URL for SEO/OG tags |

### Database

Run `supabase/migrations/0001_init.sql` once in the Supabase SQL editor. It
creates the `categories` and `transactions` tables, the `transaction_type` enum,
Row Level Security policies, and seeds the default categories.

### Auth (Supabase dashboard)

Authentication → URL Configuration:

- **Site URL**: your app URL (e.g. `http://localhost:3077` in dev)
- **Redirect URLs**: add `<site-url>/auth/callback`

The built-in email sender is rate-limited (~2/hour) and dev-only. For real use,
configure custom SMTP (e.g. Resend) in the Supabase dashboard.

## Scripts

```bash
bun run dev     # Turbopack dev server on :3077 (service worker disabled)
bun run build   # production build — runs `next build --webpack`
bun run start   # serve the production build
bun run lint
```

> The build uses `--webpack` because `@serwist/next` v9 is not yet
> Turbopack-compatible. Dev stays on Turbopack.

## Deploy (Vercel)

1. Import the repo — Bun and Next.js are auto-detected.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
   environment variables.
3. Deploy, then add the production `<domain>/auth/callback` to the Supabase
   Redirect URLs and set the Site URL.

## Docs

- `docs/PLAN.md` — phased implementation plan and status
- `docs/DESIGN.md` — visual design direction and tokens
