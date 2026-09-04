"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
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
  const user = await getCurrentUser();
  if (!user) return { error: "Kamu belum login." };

  const name = input.name.trim();
  if (!name) return { error: "Nama kategori wajib diisi." };
  if (input.type !== "income" && input.type !== "expense")
    return { error: "Tipe kategori nggak valid." };

  const db = createAdminClient();
  const row = { user_id: user.id, name, type: input.type, icon: input.icon || null };

  const { error } = input.id
    ? await db
        .from("categories")
        .update(row)
        .eq("id", input.id)
        .eq("user_id", user.id) // never touch global defaults or others' rows
    : await db.from("categories").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  if (!id) return { error: "Kategori nggak ketemu." };

  const user = await getCurrentUser();
  if (!user) return { error: "Kamu belum login." };

  const db = createAdminClient();
  const { error } = await db
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
