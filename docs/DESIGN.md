# MyFulus — UI Design Direction

Direction: **warm retro** — a "70s almanac / risograph print" feel. Cream paper
background, terracotta and mustard, chunky ink outlines, hard offset shadows.
Friendly and tactile, not corporate. Mobile-first PWA.

## Aesthetic

- Light mode is the primary look: cream paper, warm near-black ink.
- Full dark mode: warm dark brown, not neutral gray.
- Every raised element (card, button, nav) has a `2px` ink border and a hard
  `4px 4px 0` offset shadow — the "sticker / letterpress" look that keeps it from
  feeling stiff. No soft blurred shadows.
- Moderate radius, generous whitespace, one accent per screen.
- No emoji anywhere. Icons come from `lucide-react`. Category `icon` values are
  stored as lucide icon names (e.g. `wallet`, `car`) and mapped to components on
  the client.

## Color tokens

Defined in `src/app/globals.css` (`:root` and `.dark`, exposed via `@theme`).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | cream `#f6ecd8` | warm brown `#211b15` | page background |
| `--color-surface` | `#fffaef` | `#2c251d` | cards, sheets, nav |
| `--color-surface-2` | `#f0e2c6` | `#3a3125` | insets, hover |
| `--color-border` | ink `#2b2118` | `#f0e6d2` | borders (chunky, high-contrast) |
| `--color-ink` | `#2b2118` | `#100c08` | hard-shadow color |
| `--color-text` | `#2b2118` | `#f2e8d5` | primary text |
| `--color-text-muted` | `#7a6a52` | `#a99a80` | secondary text |
| `--color-primary` | terracotta `#c4562b` | `#e0733f` | primary buttons, active nav, brand |
| `--color-primary-fg` | `#fffaef` | `#211b15` | text on primary |
| `--color-accent` | mustard `#e0a730` | `#edb54a` | highlights, small emphasis |
| `--color-secondary` | teal `#2e6b5e` | `#5aa593` | secondary accents, chart series |
| `--color-income` | green `#3f7d42` | `#6fbf73` | income amounts |
| `--color-expense` | red `#b23b2e` | `#e8695a` | expense amounts |
| `--color-danger` | `#b23b2e` | `#e8695a` | destructive actions, errors |

Semantic income/expense colors are non-negotiable; terracotta primary is
brand/navigation, not "positive".

## Shape & depth

- Radius: `--radius-sm` 6px (inputs, chips), `--radius` 10px (cards, buttons),
  `--radius-lg` 16px (sheets). Full pill for the FAB and filter chips.
- Border: `--border-w` = `2px`, color `--color-border` (ink).
- Shadow: `--shadow-retro` = `4px 4px 0 var(--color-ink)`. Same in dark mode.
- Pressed state on interactive elements: translate `+2px, +2px` and drop the
  shadow (button "presses into" the page).

## Typography

- Display (`h1`–`h3`): **Fraunces** (soft, wonky old-style serif) via `next/font`,
  `--font-display`.
- Body / UI: **Space Grotesk**, `--font-sans`.
- Numbers / amounts: **Space Mono**, `--font-mono` — retro-typewriter figures for
  currency.
- Scale: h1 22, h2 18, body 15, small 13. Amounts 18–28 bold mono.
- Weights: 400 body, 500 labels/buttons, 600–700 headings and amounts.

## Spacing

4px base. Screen padding 16px. Card padding 16px. Section gap 24px. Touch
targets ≥ 44px.

## Components (plain Tailwind + tokens, no component library)

- `Button` — variants `primary` (terracotta), `ghost` (surface), `danger`. One
  size h-11, 2px border, `--shadow-retro`, press = translate + shadow off.
- `Input` / `Select` — h-11, radius `--radius-sm`, 2px border, focus border in
  `--color-primary`.
- `Card` — `surface` bg, 2px ink border, `--shadow-retro`, radius `--radius`.
- `Sheet` — bottom sheet for add/edit forms; 2px top border, `--radius-lg` top
  corners.
- `BottomNav` — sticky, `surface` bg, 2px top border, 3 items, active in
  `--color-primary`, 56px tall + safe-area inset.
- `FAB` — pill, `primary`, 2px border + shadow, bottom-right above the nav.
- `AmountText` — formats currency (mono), colors by income/expense.
- `CategoryIcon` — maps a stored lucide icon name to the `lucide-react` component.

## Motion

Cheap and physical: 100–150ms for press/translate, sheet slide-up ~250ms.
Respect `prefers-reduced-motion`. No decorative animation in v1.

## Deferred to post-MVP polish

Paper/grain texture, halftone accents, richer empty-state illustrations, chart
theming pass, skeleton loaders, install-prompt styling.
