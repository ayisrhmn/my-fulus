import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

// Default (global) categories plus the current user's own, RLS handles scoping.
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("type")
    .order("name");
  return data ?? [];
}
