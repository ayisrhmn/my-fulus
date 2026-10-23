import { ReceiptText, SearchX } from "lucide-react";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import {
  categoryFilter,
  expenseColumns,
  transactionColumns,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth/session";
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
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const [initialRows, expenses] = await Promise.all([
    sql<TransactionWithCategory[]>`
      select ${transactionColumns()}
      from transactions t
      left join categories c on c.id = t.category_id
      where t.user_id = ${user.id} and t.date >= ${from} and t.date <= ${to}
        ${categoryFilter(cat)}
      order by t.date desc, t.created_at desc
      limit ${PAGE_SIZE}
    `,
    sql<ExpenseRow[]>`
      select ${expenseColumns()}
      from transactions t
      left join categories c on c.id = t.category_id
      where t.user_id = ${user.id} and t.type = 'expense'
        and t.date >= ${from} and t.date <= ${to}
        ${categoryFilter(cat)}
    `,
  ]);

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
