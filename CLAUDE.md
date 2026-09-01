# MyFulus

Personal finance tracker. See `docs/PLAN.md` for the phased implementation plan.

## Package manager

This project uses **Bun**, not npm.

- Install: `bun install`
- Add a dependency: `bun add <pkg>` / `bun add -d <pkg>`
- Run scripts: `bun run dev`, `bun run build`, `bun run lint`
- Do not create or commit `package-lock.json`. The lockfile is `bun.lock`.

## Stack

Next.js 16 (App Router, `src/`, `@/*` alias) · TypeScript · Tailwind CSS v4
(config in `src/app/globals.css` via `@theme`, no JS config file) · Supabase
(Postgres + Auth, `@supabase/ssr`).

@AGENTS.md
