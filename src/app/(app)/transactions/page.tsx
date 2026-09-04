import { Suspense } from "react";
import { ReceiptText, SearchX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import { monthBounds } from "@/lib/date-range";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Fab } from "@/components/ui/fab";
import { SheetLink } from "@/components/sheet-link";
import { ExpenseByCategory, type ExpenseRow } from "@/components/expense-by-category";
import { TransactionFilters } from "./transaction-filters";
import { TransactionList } from "./transaction-list";
import { TransactionSheet } from "./transaction-sheet";
import { PAGE_SIZE } from "./constants";
import type { TransactionWithCategory } from "@/lib/types";

type SearchParams = {
  from?: string;
  to?: string;
  cat?: string;
  range?: string;
  sheet?: string;
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const def = monthBounds(0);
  const from = sp.from ?? def.from;
  const to = sp.to ?? def.to;
  const cat = sp.cat ?? "";

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

  const [{ data: rows }, { data: expenseRows }, categories] = await Promise.all([
    listQuery,
    expenseQuery,
    getCategories(),
  ]);

  const initialRows = (rows ?? []) as TransactionWithCategory[];
  const expenses = (expenseRows ?? []) as unknown as ExpenseRow[];
  const filtered = sp.from != null || sp.to != null || cat !== "";
  const filterKey = `${from}|${to}|${cat}`;

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-xl font-semibold">Transaksi</h1>

      <Suspense>
        <TransactionFilters categories={categories} />
      </Suspense>

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
          key={filterKey}
          initialRows={initialRows}
          filters={{ from, to, cat }}
          initialHasMore={initialRows.length === PAGE_SIZE}
        />
      )}

      <Fab basePath="/transactions" label="Tambah" />
      <Suspense>
        <TransactionSheet categories={categories} />
      </Suspense>
    </div>
  );
}
