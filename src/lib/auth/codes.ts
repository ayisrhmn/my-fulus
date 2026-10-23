import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { sql } from "@/lib/db";

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
  const [recent] = await sql<{ created_at: Date }[]>`
    select created_at from login_codes
    where email = ${email}
    order by created_at desc
    limit 1
  `;

  if (recent) {
    const age = Date.now() - recent.created_at.getTime();
    if (age < RESEND_COOLDOWN_MS) {
      return { cooldown: Math.ceil((RESEND_COOLDOWN_MS - age) / 1000) };
    }
  }

  const code = generateCode();
  await sql.begin((tx) => [
    tx`delete from login_codes where email = ${email}`,
    tx`
      insert into login_codes (email, code_hash, expires_at)
      values (${email}, ${hashCode(email, code)}, ${new Date(Date.now() + CODE_TTL_MS)})
    `,
  ]);

  return { code };
}

export type VerifyResult =
  | { ok: true; userId: string; email: string }
  | { ok: false; reason: "invalid" | "expired" | "locked" | "server" };

// Checks `code` against the latest code for `email`. On success the code is
// consumed and the matching `public.users` row is returned (created if new).
export async function verifyLoginCode(
  email: string,
  code: string,
): Promise<VerifyResult> {
  const [row] = await sql<
    { id: string; code_hash: string; expires_at: Date; attempts: number }[]
  >`
    select id, code_hash, expires_at, attempts from login_codes
    where email = ${email}
    order by created_at desc
    limit 1
  `;

  if (!row) return { ok: false, reason: "invalid" };
  if (row.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "locked" };
  if (Date.now() > row.expires_at.getTime()) {
    await sql`delete from login_codes where email = ${email}`;
    return { ok: false, reason: "expired" };
  }

  const expected = Buffer.from(row.code_hash, "hex");
  const actual = Buffer.from(hashCode(email, code), "hex");
  const match =
    expected.length === actual.length && timingSafeEqual(expected, actual);

  if (!match) {
    await sql`
      update login_codes set attempts = attempts + 1 where id = ${row.id}
    `;
    return { ok: false, reason: "invalid" };
  }

  await sql`delete from login_codes where email = ${email}`;

  try {
    // Upsert so a first login creates the user; the no-op update makes
    // `returning` yield the existing row too.
    const [user] = await sql<{ id: string; email: string }[]>`
      insert into users (email) values (${email})
      on conflict (email) do update set email = excluded.email
      returning id, email
    `;
    return { ok: true, userId: user.id, email: user.email };
  } catch (err) {
    console.error("[auth] failed to upsert user", { email, err });
    return { ok: false, reason: "server" };
  }
}
