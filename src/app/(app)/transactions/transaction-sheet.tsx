"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Sheet } from "@/components/ui/sheet";
import { TransactionForm } from "./transaction-form";
import type { Category, TransactionWithCategory } from "@/lib/types";

export function TransactionSheet({
  categories,
  transactions,
}: {
  categories: Category[];
  transactions: TransactionWithCategory[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const sheet = params.get("sheet");

  const open = sheet != null;
  const transaction =
    sheet && sheet !== "new"
      ? transactions.find((t) => t.id === sheet)
      : undefined;

  function close() {
    router.replace("/transactions");
  }

  function done() {
    close();
    router.refresh();
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => !o && close()}
      title={transaction ? "Ubah transaksi" : "Transaksi baru"}
    >
      {open && (
        <TransactionForm
          key={sheet}
          categories={categories}
          transaction={transaction}
          onDone={done}
        />
      )}
    </Sheet>
  );
}
