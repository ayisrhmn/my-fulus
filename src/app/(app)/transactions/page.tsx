import { Suspense } from "react";
import Link from "next/link";
import { ReceiptText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Fab } from "@/components/ui/fab";
import { TransactionRow } from "@/components/transaction-row";
import { TransactionSheet } from "./transaction-sheet";
import type { TransactionWithCategory } from "@/lib/types";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const [{ data }, categories] = await Promise.all([
    supabase
      .from("transactions")
      .select("*, categories(name, icon)")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
    getCategories(),
  ]);

  const transactions = (data ?? []) as TransactionWithCategory[];

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-xl font-semibold">Transaksi</h1>

      {transactions.length === 0 ? (
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
