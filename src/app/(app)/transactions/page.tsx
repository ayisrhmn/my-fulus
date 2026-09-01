import { Suspense } from "react";
import Link from "next/link";
import { ReceiptText, SearchX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import { monthBounds } from "@/lib/date-range";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Fab } from "@/components/ui/fab";
import { TransactionRow } from "@/components/transaction-row";
import { ExpenseByCategory } from "@/components/expense-by-category";
import { TransactionFilters } from "./transaction-filters";
import { TransactionSheet } from "./transaction-sheet";
import type { TransactionWithCategory } from "@/lib/types";

type SearchParams = {
  from?: string;
  to?: string;
  cat?: string;
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

  let query = supabase
    .from("transactions")
    .select("*, categories(name, icon)")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (cat === "none") query = query.is("category_id", null);
  else if (cat) query = query.eq("category_id", cat);

  const [{ data }, categories] = await Promise.all([query, getCategories()]);
  const transactions = (data ?? []) as TransactionWithCategory[];
  const expenses = transactions.filter((t) => t.type === "expense");
  const filtered = sp.from != null || sp.to != null || cat !== "";

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-xl font-semibold">Transaksi</h1>

      <Suspense>
        <TransactionFilters categories={categories} />
      </Suspense>

      <ExpenseByCategory expenses={expenses} />

      {transactions.length === 0 ? (
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
              <Link href="/transactions?sheet=new" scroll={false}>
                <Button>Tambah transaksi</Button>
              </Link>
            }
          />
        )
      ) : (
        <ul className="space-y-2">
          {transactions.map((t) => (
            <li key={t.id}>
              <TransactionRow tx={t} />
            </li>
          ))}
        </ul>
      )}

      <Fab href="/transactions?sheet=new" label="Tambah" />
      <Suspense>
        <TransactionSheet categories={categories} transactions={transactions} />
      </Suspense>
    </div>
  );
}
