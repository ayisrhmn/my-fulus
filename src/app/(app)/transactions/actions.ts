"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import {
  categoryFilter,
  isUuid,
  transactionColumns,
} from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { isIsoDate } from "@/lib/date-range";
import type { TransactionType, TransactionWithCategory } from "@/lib/types";
import { PAGE_SIZE, type TransactionFilters } from "./constants";

export type TransactionInput = {
  id?: string;
  amount: number;
  type: TransactionType;
  date: string;
  category_id: string | null;
  description: string | null;
};

export type ActionResult = { error?: string };

export async function saveTransaction(
  input: TransactionInput,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Kamu belum login." };

  if (!Number.isFinite(input.amount) || input.amount <= 0)
    return { error: "Jumlah harus lebih dari 0." };
  if (input.type !== "income" && input.type !== "expense")
    return { error: "Tipe transaksi nggak valid." };
  if (!input.date) return { error: "Tanggal wajib diisi." };
  // postgres.js serializes date params via `new Date()`, which silently rolls
  // an impossible date like 2026-02-31 into March; reject it here instead.
  if (!isIsoDate(input.date)) return { error: "Tanggal nggak valid." };

  if (input.id && !isUuid(input.id)) return { error: "Transaksi nggak ketemu." };
  const categoryId = input.category_id || null;
  if (categoryId && !isUuid(categoryId))
    return { error: "Kategori nggak valid." };

  const row = {
    user_id: user.id,
    amount: input.amount,
    type: input.type,
    date: input.date,
    category_id: categoryId,
    description: input.description?.trim() || null,
  };

  try {
    if (input.id) {
      await sql`
        update transactions set ${sql(row)}
        where id = ${input.id} and user_id = ${user.id}
      `;
    } else {
      await sql`insert into transactions ${sql(row)}`;
    }
  } catch (err) {
    console.error("[transactions] save failed", err);
    return { error: "Gagal nyimpen transaksi. Coba lagi ya." };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  if (!id) return { error: "Transaksi nggak ketemu." };

  const user = await getCurrentUser();
  if (!user) return { error: "Kamu belum login." };

  if (!isUuid(id)) return { error: "Transaksi nggak ketemu." };

  try {
    await sql`delete from transactions where id = ${id} and user_id = ${user.id}`;
  } catch (err) {
    console.error("[transactions] delete failed", err);
    return { error: "Gagal hapus transaksi. Coba lagi ya." };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}

export async function getTransaction(
  id: string,
): Promise<TransactionWithCategory | null> {
  const user = await getCurrentUser();
  if (!user || !isUuid(id)) return null;

  const [row] = await sql<TransactionWithCategory[]>`
    select ${transactionColumns()}
    from transactions t
    left join categories c on c.id = t.category_id
    where t.id = ${id} and t.user_id = ${user.id}
  `;
  return row ?? null;
}

export async function loadMoreTransactions(
  filters: TransactionFilters,
  offset: number,
): Promise<TransactionWithCategory[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  return sql<TransactionWithCategory[]>`
    select ${transactionColumns()}
    from transactions t
    left join categories c on c.id = t.category_id
    where t.user_id = ${user.id}
      and t.date >= ${filters.from} and t.date <= ${filters.to}
      ${categoryFilter(filters.cat)}
    order by t.date desc, t.created_at desc
    limit ${PAGE_SIZE} offset ${offset}
  `;
}
