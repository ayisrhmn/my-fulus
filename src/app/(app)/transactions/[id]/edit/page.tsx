import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import { TransactionForm } from "../../transaction-form";
import { DeleteButton } from "../../delete-button";
import type { TransactionWithCategory } from "@/lib/types";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: transaction }, categories] = await Promise.all([
    supabase.from("transactions").select("*").eq("id", id).single(),
    getCategories(),
  ]);

  if (!transaction) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Ubah transaksi</h1>
      <TransactionForm
        categories={categories}
        transaction={transaction as TransactionWithCategory}
      />
      <DeleteButton id={id} />
    </div>
  );
}
