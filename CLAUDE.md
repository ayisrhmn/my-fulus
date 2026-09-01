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
(tokens in `src/app/globals.css` via `@theme`, no JS config) · Supabase (Postgres
+ Auth magic link, `@supabase/ssr`; `src/proxy.ts` = Next 16's renamed
middleware) · Serwist PWA (`src/app/sw.ts`, `manifest.ts`) · `next-themes`.

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
