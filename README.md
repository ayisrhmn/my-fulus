# MyFulus

Personal finance tracker — a mobile-first PWA for logging income and expenses,
seeing a monthly summary, and breaking spending down by category. Built for
personal use, but the data model is multi-user ready.

## Stack

- **Next.js 16** (App Router, `src/`, `@/*` alias) + **TypeScript**
- **Tailwind CSS v4** — theme tokens in `src/app/globals.css` (`@theme`), no JS config
- **Postgres** — plain SQL via `postgres` (postgres.js), server-only, tables in
  a dedicated schema on a shared database
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
| `DATABASE_URL` | Postgres connection string (server-only, keep secret) |
| `DB_SCHEMA` | schema holding the app's tables; applied as the `search_path` |
| `GMAIL_USER` | the Gmail address that sends login codes |
| `GMAIL_APP_PASSWORD` | Google Account → Security → App passwords (needs 2FA on) |
| `AUTH_SECRET` | random 32+ byte string, e.g. `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | optional; your public URL for SEO/OG tags |

### Database

Create the schema, tables, and default categories once:

```bash
psql "$DATABASE_URL" -v schema=myfulus -f db/schema.sql
```

Use the same schema name as `DB_SCHEMA`. There is no RLS: every query filters
by `user_id` in server code, and the app's database role should only be granted
access to this schema. The pool is capped at 3 connections per instance because
the database is shared.

### Auth

Login is a 6-digit code emailed through Gmail SMTP, with no third-party auth
service. Set `GMAIL_USER` / `GMAIL_APP_PASSWORD` (App Password,
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
2. Add the variables from `.env.example` (`DATABASE_URL`, `DB_SCHEMA`,
   `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`).
3. Deploy.

## Docs

- `docs/PLAN.md` — phased implementation plan and status
- `docs/DESIGN.md` — visual design direction and tokens
