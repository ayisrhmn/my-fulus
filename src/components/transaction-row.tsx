import { ChevronRight } from "lucide-react";
import { SheetLink } from "@/components/sheet-link";
import { Card } from "@/components/ui/card";
import { AmountText } from "@/components/ui/amount-text";
import { CategoryIcon } from "@/components/category-icon";
import { formatDate } from "@/lib/format";
import type { TransactionWithCategory } from "@/lib/types";

// showDate: include the date in the subtitle for contexts without date headers
// (e.g. the dashboard recent list). The grouped list passes false.
export function TransactionRow({
  tx,
  showDate = false,
}: {
  tx: TransactionWithCategory;
  showDate?: boolean;
}) {
  const subtitle = showDate
    ? [formatDate(tx.date), tx.description].filter(Boolean).join(" · ")
    : tx.description;

  return (
    <SheetLink basePath="/transactions" sheet={tx.id}>
      <Card className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface-2">
          <CategoryIcon name={tx.categories?.icon ?? null} className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {tx.categories?.name ?? "Tanpa kategori"}
          </p>
          {subtitle && (
            <p className="truncate text-[13px] text-text-muted">{subtitle}</p>
          )}
        </div>
        <AmountText amount={tx.amount} type={tx.type} />
        <ChevronRight className="size-4 shrink-0 text-text-muted" />
      </Card>
    </SheetLink>
  );
}
