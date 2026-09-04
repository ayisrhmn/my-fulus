import { createAdminClient } from "@/lib/supabase/admin";
import type { Category } from "@/lib/types";

// Global defaults (user_id is null) plus the given user's own categories.
export async function getCategories(userId: string): Promise<Category[]> {
  const db = createAdminClient();
  const { data } = await db
    .from("categories")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("type")
    .order("user_id", { nullsFirst: true }) // defaults before custom
    .order("name");
  return data ?? [];
}
