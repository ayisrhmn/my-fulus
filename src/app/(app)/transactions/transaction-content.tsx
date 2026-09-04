import { ReceiptText, SearchX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SheetLink } from "@/components/sheet-link";
import { ExpenseByCategory, type ExpenseRow } from "@/components/expense-by-category";
import { TransactionList } from "./transaction-list";
import { PAGE_SIZE } from "./constants";
import type { TransactionWithCategory } from "@/lib/types";

export async function TransactionContent({
  from,
  to,
  cat,
  filtered,
}: {
  from: string;
  to: string;
  cat: string;
  filtered: boolean;
}) {
  const supabase = await createClient();

  let listQuery = supabase
    .from("transactions")
    .select("*, categories(name, icon)")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);
  let expenseQuery = supabase
    .from("transactions")
    .select("amount, category_id, categories(name, icon)")
    .eq("type", "expense")
    .gte("date", from)
    .lte("date", to);

  if (cat === "none") {
    listQuery = listQuery.is("category_id", null);
    expenseQuery = expenseQuery.is("category_id", null);
  } else if (cat) {
    listQuery = listQuery.eq("category_id", cat);
    expenseQuery = expenseQuery.eq("category_id", cat);
  }

  const [{ data: rows }, { data: expenseRows }] = await Promise.all([
    listQuery,
    expenseQuery,
  ]);

  const initialRows = (rows ?? []) as TransactionWithCategory[];
  const expenses = (expenseRows ?? []) as unknown as ExpenseRow[];

  return (
    <>
      <ExpenseByCategory expenses={expenses} collapsible />

      {initialRows.length === 0 ? (
        filtered ? (
          <EmptyState
            icon={SearchX}
            title="Kosong di sini"
            description="Nggak ada transaksi yang cocok sama filter ini. Coba ubah rentang atau kategorinya."
          />
        ) : (
          <EmptyState
            icon={ReceiptText}
            title="Dompet masih adem"
            description="Belum ada transaksi tercatat. Mulai dari yang pertama, yuk."
            action={
              <SheetLink basePath="/transactions" sheet="new">
                <Button>Tambah transaksi</Button>
              </SheetLink>
            }
          />
        )
      ) : (
        <TransactionList
          initialRows={initialRows}
          filters={{ from, to, cat }}
          initialHasMore={initialRows.length === PAGE_SIZE}
        />
      )}
    </>
  );
}
