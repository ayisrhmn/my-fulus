"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TransactionType } from "@/lib/types";

export type CategoryInput = {
  id?: string;
  name: string;
  type: TransactionType;
  icon: string | null;
};

export type ActionResult = { error?: string };

export async function saveCategory(
  input: CategoryInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Kamu belum login." };

  const name = input.name.trim();
  if (!name) return { error: "Nama kategori wajib diisi." };
  if (input.type !== "income" && input.type !== "expense")
    return { error: "Tipe kategori nggak valid." };

  const row = { user_id: user.id, name, type: input.type, icon: input.icon || null };

  const { error } = input.id
    ? await supabase
        .from("categories")
        .update(row)
        .eq("id", input.id)
        .eq("user_id", user.id) // never touch global defaults
    : await supabase.from("categories").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  if (!id) return { error: "Kategori nggak ketemu." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Kamu belum login." };

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}
