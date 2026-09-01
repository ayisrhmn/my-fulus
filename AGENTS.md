# MyFulus project rules

- Package manager is **Bun**, not npm. Use `bun install`, `bun add`, `bun run <script>`.
  Never commit `package-lock.json`; the lockfile is `bun.lock`.
- Plan and phase status live in `docs/PLAN.md`.
- User-facing copy is Bahasa Indonesia, casual Gen-Z tone ("kamu", not "Anda").
  Code, comments, commits, and docs stay in English.
- No emoji in the UI or seed data. Use `lucide-react` for all icons.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
