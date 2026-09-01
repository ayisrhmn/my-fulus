"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Kamu belum login." };

  if (!Number.isFinite(input.amount) || input.amount <= 0)
    return { error: "Jumlah harus lebih dari 0." };
  if (input.type !== "income" && input.type !== "expense")
    return { error: "Tipe transaksi nggak valid." };
  if (!input.date) return { error: "Tanggal wajib diisi." };

  const row = {
    user_id: user.id,
    amount: input.amount,
    type: input.type,
    date: input.date,
    category_id: input.category_id || null,
    description: input.description?.trim() || null,
  };

  const { error } = input.id
    ? await supabase.from("transactions").update(row).eq("id", input.id)
    : await supabase.from("transactions").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  if (!id) return { error: "Transaksi nggak ketemu." };

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}

export async function getTransaction(
  id: string,
): Promise<TransactionWithCategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transactions")
    .select("*, categories(name, icon)")
    .eq("id", id)
    .single();
  return (data as TransactionWithCategory) ?? null;
}

export async function loadMoreTransactions(
  filters: TransactionFilters,
  offset: number,
): Promise<TransactionWithCategory[]> {
  const supabase = await createClient();
  let q = supabase
    .from("transactions")
    .select("*, categories(name, icon)")
    .gte("date", filters.from)
    .lte("date", filters.to)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (filters.cat === "none") q = q.is("category_id", null);
  else if (filters.cat) q = q.eq("category_id", filters.cat);

  const { data } = await q;
  return (data ?? []) as TransactionWithCategory[];
}
