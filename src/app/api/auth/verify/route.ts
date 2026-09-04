import { NextResponse } from "next/server";
import { verifyLoginCode } from "@/lib/auth/codes";
import { createSession } from "@/lib/auth/session";

const MESSAGES: Record<"invalid" | "expired" | "locked", string> = {
  invalid: "Kode salah. Coba cek lagi.",
  expired: "Kodenya udah kadaluarsa. Minta kode baru ya.",
  locked: "Kebanyakan salah. Minta kode baru ya.",
};

export async function POST(request: Request) {
  let body: { email?: unknown; code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request nggak valid." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Kode harus 6 digit." }, { status: 400 });
  }

  const result = await verifyLoginCode(email, code);
  if (!result.ok) {
    return NextResponse.json(
      { error: MESSAGES[result.reason] },
      { status: 400 },
    );
  }

  await createSession({ id: result.userId, email: result.email });
  return NextResponse.json({ ok: true });
}
