# MyFulus

Personal finance tracker — a mobile-first PWA for logging income and expenses,
seeing a monthly summary, and breaking spending down by category. Built for
personal use, but the data model is multi-user ready.

## Stack

- **Next.js 16** (App Router, `src/`, `@/*` alias) + **TypeScript**
- **Tailwind CSS v4** — theme tokens in `src/app/globals.css` (`@theme`), no JS config
- **Supabase** — Postgres only (no Supabase Auth), server-side access with the
  service-role key
- **Auth** — custom 6-digit email code, Gmail SMTP via `nodemailer`, `jose` JWT
  session cookie
- **Serwist** (`@serwist/next`) — service worker / installable PWA
- Forms: **react-hook-form**, **Radix UI** (Select / Dialog / Popover),
  **react-day-picker**, **sonner** toasts
- **Bun** package manager · deploy target **Vercel**

## Setup

```bash
bun install
cp .env.example .env        # then fill in the values below
```

`.env` needs:

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same page (`anon` / `public` key) |
| `SUPABASE_SERVICE_ROLE_KEY` | same page (`service_role` key — server-only, keep secret) |
| `GMAIL_USER` | the Gmail address that sends login codes |
| `GMAIL_APP_PASSWORD` | Google Account → Security → App passwords (needs 2FA on) |
| `AUTH_SECRET` | random 32+ byte string, e.g. `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | optional; your public URL for SEO/OG tags |

### Database

Run these once in the Supabase SQL editor, in order:

1. `supabase/migrations/0001_init.sql` — `categories` / `transactions` tables,
   the `transaction_type` enum, RLS policies, and the default categories.
2. `supabase/migrations/0002_custom_auth.sql` — `public.users` and
   `public.login_codes`, re-points the `user_id` FKs off `auth.users`, and drops
   the `auth.uid()` RLS policies. Non-destructive; verification queries are in
   the file's trailing comment.

### Auth

Login is a 6-digit code emailed through Gmail SMTP — no Supabase Auth, no
dashboard configuration. Set `GMAIL_USER` / `GMAIL_APP_PASSWORD` (App Password,
Google 2FA required) and `AUTH_SECRET`. Gmail SMTP sends to any address at
~500 mails/day; past that, switch to a real ESP on a paid domain.

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
