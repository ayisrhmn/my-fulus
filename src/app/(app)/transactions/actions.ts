"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TransactionType } from "@/lib/types";

export type FormState = { error?: string };

function parse(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const type = String(formData.get("type")) as TransactionType;
  const date = String(formData.get("date"));
  const categoryId = String(formData.get("category_id") || "");
  const description = String(formData.get("description") || "").trim();

  if (!Number.isFinite(amount) || amount <= 0) return { error: "Jumlah harus lebih dari 0." };
  if (type !== "income" && type !== "expense") return { error: "Tipe transaksi nggak valid." };
  if (!date) return { error: "Tanggal wajib diisi." };

  return {
    values: {
      amount,
      type,
      date,
      category_id: categoryId || null,
      description: description || null,
    },
  };
}

export async function saveTransaction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Kamu belum login." };

  const parsed = parse(formData);
  if (parsed.error) return { error: parsed.error };

  const id = String(formData.get("id") || "");
  const row = { ...parsed.values, user_id: user.id };

  const { error } = id
    ? await supabase.from("transactions").update(row).eq("id", id)
    : await supabase.from("transactions").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  redirect("/transactions");
}

export async function deleteTransaction(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  redirect("/transactions");
}
