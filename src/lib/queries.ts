import "server-only";
import { sql } from "@/lib/db";
import type { Category } from "@/lib/types";

// Global defaults (user_id is null) plus the given user's own categories.
export async function getCategories(userId: string): Promise<Category[]> {
  return sql<Category[]>`
    select id, user_id, name, type, icon, color
    from categories
    where user_id is null or user_id = ${userId}
    order by type, user_id nulls first, name
  `;
}

// Columns for a `TransactionWithCategory` row; use with `from transactions t
// left join categories c on c.id = t.category_id`. Casts keep the shapes the
// UI expects: `amount` as a number, `date` as yyyy-MM-dd, `created_at` as an
// ISO string, and `categories` as `{ name, icon }` or null.
export function transactionColumns() {
  return sql`
    t.id, t.user_id, t.amount::float8 as amount, t.type, t.category_id,
    t.description, t.date::text as date,
    to_json(t.created_at) #>> '{}' as created_at,
    case when c.id is null then null
         else json_build_object('name', c.name, 'icon', c.icon)
    end as categories
  `;
}

// Columns for an `ExpenseRow`; same join as `transactionColumns`.
export function expenseColumns() {
  return sql`
    t.amount::float8 as amount, t.category_id,
    case when c.id is null then null
         else json_build_object('name', c.name, 'icon', c.icon)
    end as categories
  `;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Guards ids that come from the URL or the client: Postgres rejects a
// malformed uuid with an error instead of matching nothing.
export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

// Category filter used by the transactions list: "" = all, "none" =
// uncategorized, otherwise a category id (a malformed id matches nothing).
export function categoryFilter(cat: string) {
  if (cat === "none") return sql`and t.category_id is null`;
  if (!cat) return sql``;
  return isUuid(cat) ? sql`and t.category_id = ${cat}` : sql`and false`;
}
