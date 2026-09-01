import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Fab } from "@/components/ui/fab";
import { AmountText } from "@/components/ui/amount-text";
import { formatDate } from "@/lib/format";
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
        <p className="text-[13px] text-text-muted">
          Belum ada transaksi. Tap tombol + buat nambah.
        </p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((t) => (
            <li key={t.id}>
              <Link href={`/transactions?sheet=${t.id}`} scroll={false}>
                <Card className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {t.categories?.name ?? "Tanpa kategori"}
                    </p>
                    <p className="truncate text-[13px] text-text-muted">
                      {t.description || formatDate(t.date)}
                    </p>
                  </div>
                  <AmountText amount={t.amount} type={t.type} />
                </Card>
              </Link>
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
