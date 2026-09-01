const pad = (n: number) => String(n).padStart(2, "0");
export const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Inclusive [from, to] bounds for a calendar month. offset 0 = this month, -1 = last.
export function monthBounds(offset = 0, now = new Date()) {
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const last = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
  return { from: iso(first), to: iso(last) };
}

export type RangePreset = "this" | "last" | "custom";

export function detectPreset(from: string, to: string): RangePreset {
  const t = monthBounds(0);
  const l = monthBounds(-1);
  if (from === t.from && to === t.to) return "this";
  if (from === l.from && to === l.to) return "last";
  return "custom";
}
