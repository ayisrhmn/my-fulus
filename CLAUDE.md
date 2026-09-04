# MyFulus

Personal finance tracker. See `docs/PLAN.md` for the phased implementation plan.

## Package manager & commands

This project uses **Bun**, not npm.

- Install: `bun install` · Add: `bun add <pkg>` / `bun add -d <pkg>`
- Do not create or commit `package-lock.json`. The lockfile is `bun.lock`.
- `bun run dev` — Turbopack dev server on port **3077**; service worker disabled.
- `bun run build` — runs `next build --webpack`. `@serwist/next` v9 is not
  Turbopack-compatible; `next.config.ts` keeps an empty `turbopack: {}` so the
  Turbopack dev server still starts. Don't drop the `--webpack` flag or that block.
- `bun run lint` before every commit. Work on branch `dev`, one commit per
  logical step; Fariz reviews and pushes — never push.

## Copywriting

All user-facing copy is in **Bahasa Indonesia**, casual Gen-Z tone (santai,
gaul, "kamu" not "Anda"). Applies to UI labels, buttons, empty states, error
messages, toasts, and the Supabase auth emails. Keep it readable — casual, not
cringe. Code identifiers, comments, commit messages, and docs stay in English.

## Icons

No emoji in the UI or in seed data. Use `lucide-react` for every icon. Category
`icon` values are stored as lucide icon names.

## Stack

Next.js 16 (App Router, `src/`, `@/*` alias) · TypeScript · Tailwind CSS v4
(tokens in `src/app/globals.css` via `@theme`, no JS config) · Supabase as a
plain Postgres store, accessed server-only with the service-role key
(`src/lib/supabase/admin.ts`) — no Supabase Auth, no RLS, so every query must
filter `user_id` itself · custom email-code auth (Gmail SMTP via `nodemailer` +
`jose` JWT session cookie, `src/lib/auth/`; `src/proxy.ts` = Next 16's renamed
middleware) · Serwist PWA (`src/app/sw.ts`, `manifest.ts`) · `next-themes`.

## Auth

Login is a 6-digit code emailed via Gmail SMTP (`nodemailer`, `src/lib/email.ts`),
not Supabase Auth (its default SMTP rate limit was too low). Flow:
`POST /api/auth/request-code` stores a hashed code in `public.login_codes`;
`POST /api/auth/verify` checks it, upserts `public.users`, and sets a
`jose`-signed `session` cookie (HS256, `AUTH_SECRET`, 7-day expiry).
`src/lib/auth/token.ts` is edge-safe for `proxy.ts`; `src/lib/auth/session.ts`
(`getCurrentUser` / `requireUser`) is server-only.
Env: `GMAIL_USER`, `GMAIL_APP_PASSWORD` (Google account App Password, 2FA on),
`AUTH_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`. Gmail SMTP caps at ~500 mails/day.

## Forms & UI conventions

- All forms use **react-hook-form** for validation (including login).
- No native `<select>` or `<input type="date">` — use the `Select` (Radix) and
  `DatePicker` (react-day-picker) primitives in `src/components/ui/`.
- CRUD add/edit happens in a bottom **`Sheet`** (Radix Dialog), driven by a
  `?sheet=` query param. Destructive actions use `InlineDelete` (two-step) or a
  confirm `Sheet` — never `window.confirm`.
- Success feedback via **sonner** `toast.success`; validation errors stay inline.
- Mutations are server actions that `revalidatePath` the affected routes; client
  callers then `router.refresh()`.

@AGENTS.md
