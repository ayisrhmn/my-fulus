import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AmountText } from "@/components/ui/amount-text";
import { CategoryIcon } from "@/components/category-icon";
import { formatDate } from "@/lib/format";
import type { TransactionWithCategory } from "@/lib/types";

export function TransactionRow({ tx }: { tx: TransactionWithCategory }) {
  return (
    <Link href={`/transactions?sheet=${tx.id}`} scroll={false}>
      <Card className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface-2">
          <CategoryIcon name={tx.categories?.icon ?? null} className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {tx.categories?.name ?? "Tanpa kategori"}
          </p>
          <p className="truncate text-[13px] text-text-muted">
            {tx.description || formatDate(tx.date)}
          </p>
        </div>
        <AmountText amount={tx.amount} type={tx.type} />
      </Card>
    </Link>
  );
}
