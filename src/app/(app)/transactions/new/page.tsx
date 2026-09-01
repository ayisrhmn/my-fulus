import { getCategories } from "@/lib/queries";
import { TransactionForm } from "../transaction-form";

export default async function NewTransactionPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Transaksi baru</h1>
      <TransactionForm categories={categories} />
    </div>
  );
}
