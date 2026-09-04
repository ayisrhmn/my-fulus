import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute between requests per email
const MAX_ATTEMPTS = 5;

function hashCode(email: string, code: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET!)
    .update(`${email}:${code}`)
    .digest("hex");
}

function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export type IssueResult = { code: string } | { cooldown: number };

// Creates a fresh login code for `email`, replacing any earlier one.
// Returns `{ cooldown }` (seconds) if the last request was too recent.
export async function issueLoginCode(email: string): Promise<IssueResult> {
  const db = createAdminClient();

  const { data: recent } = await db
    .from("login_codes")
    .select("created_at")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent) {
    const age = Date.now() - new Date(recent.created_at).getTime();
    if (age < RESEND_COOLDOWN_MS) {
      return { cooldown: Math.ceil((RESEND_COOLDOWN_MS - age) / 1000) };
    }
  }

  const code = generateCode();
  await db.from("login_codes").delete().eq("email", email);
  await db.from("login_codes").insert({
    email,
    code_hash: hashCode(email, code),
    expires_at: new Date(Date.now() + CODE_TTL_MS).toISOString(),
  });

  return { code };
}

export type VerifyResult =
  | { ok: true; userId: string; email: string }
  | { ok: false; reason: "invalid" | "expired" | "locked" };

// Checks `code` against the latest code for `email`. On success the code is
// consumed and the matching `public.users` row is returned (created if new).
export async function verifyLoginCode(
  email: string,
  code: string,
): Promise<VerifyResult> {
  const db = createAdminClient();

  const { data: row } = await db
    .from("login_codes")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!row) return { ok: false, reason: "invalid" };
  if (row.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "locked" };
  if (Date.now() > new Date(row.expires_at).getTime()) {
    await db.from("login_codes").delete().eq("email", email);
    return { ok: false, reason: "expired" };
  }

  const expected = Buffer.from(row.code_hash, "hex");
  const actual = Buffer.from(hashCode(email, code), "hex");
  const match =
    expected.length === actual.length && timingSafeEqual(expected, actual);

  if (!match) {
    await db
      .from("login_codes")
      .update({ attempts: row.attempts + 1 })
      .eq("id", row.id);
    return { ok: false, reason: "invalid" };
  }

  await db.from("login_codes").delete().eq("email", email);

  const { data: existing } = await db
    .from("users")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return { ok: true, userId: existing.id, email: existing.email };
  }

  const { data: created, error } = await db
    .from("users")
    .insert({ email })
    .select("id, email")
    .single();

  if (error || !created) return { ok: false, reason: "invalid" };
  return { ok: true, userId: created.id, email: created.email };
}
