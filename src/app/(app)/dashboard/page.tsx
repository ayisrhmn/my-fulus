import Link from "next/link";
import { PiggyBank } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TransactionRow } from "@/components/transaction-row";
import {
  ExpenseByCategory,
  type ExpenseRow,
} from "@/components/expense-by-category";
import { formatIDR } from "@/lib/format";
import type { TransactionWithCategory } from "@/lib/types";

function monthRange(now = new Date()) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const from = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  const nx = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const to = `${nx.getFullYear()}-${pad(nx.getMonth() + 1)}-01`;
  return { from, to };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const now = new Date();
  const { from, to } = monthRange(now);

  const [
    { data: userData },
    { data: monthRows },
    { data: recentRows },
    { data: expenseRows },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("transactions")
      .select("amount, type")
      .gte("date", from)
      .lt("date", to),
    supabase
      .from("transactions")
      .select("*, categories(name, icon)")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("transactions")
      .select("amount, category_id, categories(name, icon)")
      .eq("type", "expense")
      .gte("date", from)
      .lt("date", to),
  ]);

  const name = userData.user?.email?.split("@")[0] ?? "kamu";

  const income = (monthRows ?? [])
    .filter((r) => r.type === "income")
    .reduce((s, r) => s + Number(r.amount), 0);
  const expense = (monthRows ?? [])
    .filter((r) => r.type === "expense")
    .reduce((s, r) => s + Number(r.amount), 0);
  const balance = income - expense;

  const recent = (recentRows ?? []) as TransactionWithCategory[];
  const expenses = (expenseRows ?? []) as unknown as ExpenseRow[];
  const monthLabel = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4 pb-24">
      <div>
        <h1 className="text-xl font-semibold">Hi, {name}</h1>
        <p className="text-[13px] text-text-muted">
          Ringkasan {monthLabel}
        </p>
      </div>

      <Card className="space-y-1">
        <p className="text-[13px] text-text-muted">Saldo bulan ini</p>
        <p
          className={`font-mono text-2xl font-bold ${
            balance < 0 ? "text-expense" : ""
          }`}
        >
          {formatIDR(balance)}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="space-y-1">
          <p className="text-[13px] text-text-muted">Pemasukan</p>
          <p className="font-mono text-lg font-bold text-income">
            {formatIDR(income)}
          </p>
        </Card>
        <Card className="space-y-1">
          <p className="text-[13px] text-text-muted">Pengeluaran</p>
          <p className="font-mono text-lg font-bold text-expense">
            {formatIDR(expense)}
          </p>
        </Card>
      </div>

      <ExpenseByCategory expenses={expenses} />

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-[13px] font-medium text-text-muted">
          Transaksi terakhir
        </h2>
        <Link href="/transactions" className="text-[13px] text-primary">
          Lihat semua
        </Link>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="Belum ada apa-apa"
          description="Catat transaksi pertama biar ringkasan ini mulai hidup."
          action={
            <Link href="/transactions?sheet=new" scroll={false}>
              <Button>Tambah transaksi</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-2">
          {recent.map((t) => (
            <li key={t.id}>
              <TransactionRow tx={t} showDate />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
