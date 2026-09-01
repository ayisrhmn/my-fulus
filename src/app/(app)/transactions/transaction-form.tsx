"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { saveTransaction, deleteTransaction } from "./actions";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { MoneyInput } from "@/components/ui/money-input";
import { DatePicker } from "@/components/ui/date-picker";
import type { Category, TransactionType, TransactionWithCategory } from "@/lib/types";

type FormValues = {
  type: TransactionType;
  amount: number;
  category_id: string;
  date: string;
  description: string;
};

const label = "mb-1 block text-[13px] text-text-muted";
const input =
  "w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 py-3 text-base outline-none focus:border-primary";

export function TransactionForm({
  categories,
  transaction,
  onDone,
}: {
  categories: Category[];
  transaction?: TransactionWithCategory;
  onDone: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [serverError, setServerError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      type: transaction?.type ?? "expense",
      amount: transaction?.amount ?? ("" as unknown as number),
      category_id: transaction?.category_id ?? "",
      date: transaction?.date ?? today,
      description: transaction?.description ?? "",
    },
  });

  const type = useWatch({ control, name: "type" });
  const options = categories
    .filter((c) => c.type === type)
    .map((c) => ({ value: c.id, label: c.name }));

  async function onSubmit(values: FormValues) {
    setServerError("");
    const res = await saveTransaction({
      id: transaction?.id,
      amount: Number(values.amount),
      type: values.type,
      date: values.date,
      category_id: values.category_id || null,
      description: values.description || null,
    });
    if (res.error) setServerError(res.error);
    else onDone();
  }

  async function onDelete() {
    if (!transaction || !confirm("Hapus transaksi ini?")) return;
    setDeleting(true);
    const res = await deleteTransaction(transaction.id);
    setDeleting(false);
    if (res.error) setServerError(res.error);
    else onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2">
            {(["expense", "income"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => field.onChange(t)}
                className={`rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border py-3 text-center text-[15px] font-medium ${
                  field.value === t ? "bg-primary text-primary-fg" : "bg-surface"
                }`}
              >
                {t === "expense" ? "Pengeluaran" : "Pemasukan"}
              </button>
            ))}
          </div>
        )}
      />

      <div>
        <label className={label}>Jumlah</label>
        <Controller
          control={control}
          name="amount"
          rules={{
            validate: (v) =>
              (typeof v === "number" && v > 0) || "Jumlah harus lebih dari 0.",
          }}
          render={({ field }) => (
            <MoneyInput
              autoFocus
              value={field.value as number | ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-danger">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className={label}>Kategori</label>
        <Controller
          control={control}
          name="category_id"
          render={({ field }) => (
            <Select
              ariaLabel="Kategori"
              value={field.value}
              onValueChange={field.onChange}
              options={[{ value: "", label: "Tanpa kategori" }, ...options]}
              placeholder="Tanpa kategori"
            />
          )}
        />
      </div>

      <div>
        <label className={label}>Tanggal</label>
        <Controller
          control={control}
          name="date"
          rules={{ required: "Tanggal wajib diisi." }}
          render={({ field }) => (
            <DatePicker value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-danger">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className={label}>Catatan (opsional)</label>
        <input
          type="text"
          placeholder="mis. makan siang"
          className={input}
          {...register("description")}
        />
      </div>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Menyimpan…" : "Simpan"}
        </Button>
        {transaction && (
          <Button
            type="button"
            variant="danger"
            disabled={deleting}
            onClick={onDelete}
          >
            {deleting ? "Menghapus…" : "Hapus"}
          </Button>
        )}
      </div>
    </form>
  );
}
