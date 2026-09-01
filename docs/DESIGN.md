# MyFulus — UI Design Direction

Direction: "playful yet professional" — a modern Indonesian ed-tech / consumer
aesthetic, adapted for a mobile-first personal finance PWA.

## Aesthetic

Clean, modern, friendly. Dark-first but full light mode. Generous whitespace,
card-based layout, rounded corners, subtle depth.

No emoji anywhere in the UI. Icons come from `lucide-react`. Category `icon`
values are stored as lucide icon names (e.g. `wallet`, `car`) and mapped to
components on the client.

## Color tokens

Defined in `src/app/globals.css` under `@theme`. Names below are the intent;
exact hex tuned during Phase 4.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | near-white `#fafafa` | deep navy/charcoal `#0f1419` | page background |
| `--color-surface` | `#ffffff` | `#1a2029` | cards, sheets, nav |
| `--color-surface-2` | `#f4f4f5` | `#232b36` | insets, hover |
| `--color-border` | `#e4e4e7` | `#2c343f` | hairlines |
| `--color-text` | `#18181b` | `#f4f5f7` | primary text |
| `--color-text-muted` | `#71717a` | `#9aa4b2` | secondary text |
| `--color-primary` | cyan/turquoise `#06b6d4` | `#22d3ee` | brand, primary buttons, active nav |
| `--color-primary-fg` | `#ffffff` | `#04222b` | text on primary |
| `--color-accent` | gold `#f5b942` | `#f5b942` | sparkle highlights, small emphasis |
| `--color-income` | green `#16a34a` | `#4ade80` | income amounts |
| `--color-expense` | red `#dc2626` | `#f87171` | expense amounts |
| `--color-danger` | red `#dc2626` | `#f87171` | destructive actions, errors |

Semantic income/expense colors are non-negotiable in a finance app; the cyan
primary is brand/navigation, not "positive".

## Shape & depth

- Radius: `--radius-sm` 8px (inputs, chips), `--radius` 14px (cards, buttons),
  `--radius-lg` 20px (sheets, modals). Full pill for FAB and filter chips.
- Shadow: one soft elevation token for cards (`0 1px 3px rgba(0,0,0,.08)` light;
  near-none in dark — lean on `surface` contrast instead).
- Borders do most of the separation work, especially in dark mode.

## Typography

- Font: keep the scaffold's Geist Sans (geometric, modern, close to the
  reference). Geist Mono for amounts if tabular alignment needs it.
- Scale: display 32/28, h1 22, h2 18, body 15, small 13. Line-height ~1.4 body,
  ~1.2 headings.
- Weights: 400 body, 500 labels/buttons, 600 headings. No lighter than 400 on
  mobile.

## Spacing

4px base. Screen padding 16px. Card padding 16px. Section gap 24px. Touch
targets ≥ 44px.

## Components (built in Phase 4, plain Tailwind + tokens, no component library)

- `Button` — variants: `primary` (cyan fill), `ghost`, `danger`. One size,
  h-11, radius `--radius`, weight 500.
- `Input` / `Select` — h-11, radius `--radius-sm`, 1px border, focus ring in
  `--color-primary`.
- `Card` — `surface` bg, 1px border, card shadow, radius `--radius`, 16px pad.
- `Sheet` — bottom sheet for add/edit forms (mobile-native feel), radius
  `--radius-lg` top corners.
- `BottomNav` — fixed, `surface` bg, top border, 3–4 items, active item in
  `--color-primary`, 56px tall + safe-area inset.
- `FAB` — pill/round, `primary`, bottom-right above the nav, for "add
  transaction".
- `AmountText` — formats currency, colors by income/expense.
- `CategoryIcon` — maps a stored lucide icon name to the `lucide-react` component.

## Motion

Cheap and subtle: 150ms ease for hover/press, sheet slide-up 250ms. Respect
`prefers-reduced-motion`. No scroll-jacking, no decorative animation in v1.

## Deferred to post-MVP polish

Micro-interactions, richer empty-state illustrations, chart theming pass,
skeleton loaders, haptics, install-prompt styling.
