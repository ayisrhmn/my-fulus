import { Card } from "@/components/ui/card";
import { CategoryIcon } from "@/components/category-icon";
import { formatIDR } from "@/lib/format";

export type ExpenseRow = {
  amount: number;
  category_id: string | null;
  categories: { name: string; icon: string | null } | null;
};

type Slice = { name: string; icon: string | null; amount: number };

function aggregate(expenses: ExpenseRow[]): Slice[] {
  const map = new Map<string, Slice>();
  for (const t of expenses) {
    const key = t.category_id ?? "none";
    const cur = map.get(key) ?? {
      name: t.categories?.name ?? "Tanpa kategori",
      icon: t.categories?.icon ?? null,
      amount: 0,
    };
    cur.amount += Number(t.amount);
    map.set(key, cur);
  }
  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

export function ExpenseByCategory({
  expenses,
  limit,
}: {
  expenses: ExpenseRow[];
  limit?: number;
}) {
  if (expenses.length === 0) return null;

  const all = aggregate(expenses);
  const total = all.reduce((s, x) => s + x.amount, 0);

  let slices = all;
  if (limit && all.length > limit) {
    const rest = all.slice(limit).reduce((s, x) => s + x.amount, 0);
    slices = [
      ...all.slice(0, limit),
      { name: "Lainnya", icon: null, amount: rest },
    ];
  }
  const max = Math.max(...slices.map((s) => s.amount));

  return (
    <Card className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[13px] font-medium text-text-muted">
          Pengeluaran per kategori
        </h2>
        <span className="font-mono text-[13px] font-bold text-expense">
          {formatIDR(total)}
        </span>
      </div>

      <ul className="space-y-2">
        {slices.map((s) => (
          <li key={s.name} className="space-y-1">
            <div className="flex items-center gap-2 text-[13px]">
              <CategoryIcon name={s.icon} className="size-4 shrink-0" />
              <span className="flex-1 truncate">{s.name}</span>
              <span className="font-mono">{formatIDR(s.amount)}</span>
              <span className="w-10 text-right text-text-muted">
                {Math.round((s.amount / total) * 100)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full border-[length:var(--border-w)] border-border bg-surface-2">
              <div
                className="h-full bg-expense"
                style={{ width: `${Math.max((s.amount / max) * 100, 4)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
