"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { isUuid } from "@/lib/queries";
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

  if (input.id && !isUuid(input.id)) return { error: "Kategori nggak ketemu." };

  const row = { user_id: user.id, name, type: input.type, icon: input.icon || null };

  try {
    if (input.id) {
      // Scoped by user_id: never touch global defaults or others' rows.
      await sql`
        update categories set ${sql(row)}
        where id = ${input.id} and user_id = ${user.id}
      `;
    } else {
      await sql`insert into categories ${sql(row)}`;
    }
  } catch (err) {
    console.error("[categories] save failed", err);
    return { error: "Gagal nyimpen kategori. Coba lagi ya." };
  }

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  if (!id) return { error: "Kategori nggak ketemu." };

  const user = await getCurrentUser();
  if (!user) return { error: "Kamu belum login." };

  if (!isUuid(id)) return { error: "Kategori nggak ketemu." };

  try {
    await sql`delete from categories where id = ${id} and user_id = ${user.id}`;
  } catch (err) {
    console.error("[categories] delete failed", err);
    return { error: "Gagal hapus kategori. Coba lagi ya." };
  }

  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return {};
}
