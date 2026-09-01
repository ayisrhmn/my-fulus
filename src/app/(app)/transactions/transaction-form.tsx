"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveTransaction, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import type { Category, TransactionWithCategory } from "@/lib/types";

const field =
  "w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 py-3 text-base outline-none focus:border-primary";

export function TransactionForm({
  categories,
  transaction,
}: {
  categories: Category[];
  transaction?: TransactionWithCategory;
}) {
  const [type, setType] = useState(transaction?.type ?? "expense");
  const [state, action, pending] = useActionState<FormState, FormData>(
    saveTransaction,
    {},
  );

  const options = categories.filter((c) => c.type === type);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="space-y-4">
      {transaction && <input type="hidden" name="id" value={transaction.id} />}

      <div className="grid grid-cols-2 gap-2">
        {(["expense", "income"] as const).map((t) => (
          <label
            key={t}
            className={`cursor-pointer rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border py-3 text-center text-[15px] font-medium ${
              type === t ? "bg-primary text-primary-fg" : "bg-surface"
            }`}
          >
            <input
              type="radio"
              name="type"
              value={t}
              checked={type === t}
              onChange={() => setType(t)}
              className="sr-only"
            />
            {t === "expense" ? "Pengeluaran" : "Pemasukan"}
          </label>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-[13px] text-text-muted">Jumlah</label>
        <input
          name="amount"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          required
          autoFocus
          defaultValue={transaction?.amount}
          placeholder="0"
          className={field}
        />
      </div>

      <div>
        <label className="mb-1 block text-[13px] text-text-muted">Kategori</label>
        <select
          name="category_id"
          defaultValue={transaction?.category_id ?? ""}
          className={field}
        >
          <option value="">Tanpa kategori</option>
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-[13px] text-text-muted">Tanggal</label>
        <input
          name="date"
          type="date"
          required
          defaultValue={transaction?.date ?? today}
          className={field}
        />
      </div>

      <div>
        <label className="mb-1 block text-[13px] text-text-muted">
          Catatan (opsional)
        </label>
        <input
          name="description"
          type="text"
          defaultValue={transaction?.description ?? ""}
          placeholder="mis. makan siang"
          className={field}
        />
      </div>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "Menyimpan…" : "Simpan"}
        </Button>
        <Link href="/transactions">
          <Button type="button" variant="ghost">
            Batal
          </Button>
        </Link>
      </div>
    </form>
  );
}
