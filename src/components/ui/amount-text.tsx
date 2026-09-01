import { formatIDR } from "@/lib/format";
import type { TransactionType } from "@/lib/types";

export function AmountText({
  amount,
  type,
  className = "",
}: {
  amount: number;
  type: TransactionType;
  className?: string;
}) {
  const sign = type === "income" ? "+" : "-";
  const color = type === "income" ? "text-income" : "text-expense";
  return (
    <span className={`font-mono font-bold ${color} ${className}`}>
      {sign}
      {formatIDR(amount)}
    </span>
  );
}
