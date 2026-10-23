import { NextResponse } from "next/server";
import { issueLoginCode } from "@/lib/auth/codes";
import { sendLoginCode } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request nggak valid." }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Format email nggak valid." },
      { status: 400 },
    );
  }

  let result: Awaited<ReturnType<typeof issueLoginCode>>;
  try {
    result = await issueLoginCode(email);
  } catch (err) {
    console.error("[auth] failed to issue login code", err);
    return NextResponse.json(
      { error: "Ada masalah di server. Coba lagi bentar ya." },
      { status: 500 },
    );
  }
  if ("cooldown" in result) {
    return NextResponse.json(
      { error: `Sabar ya, coba lagi ${result.cooldown} detik lagi.` },
      { status: 429 },
    );
  }

  try {
    await sendLoginCode(email, result.code);
  } catch {
    return NextResponse.json(
      { error: "Gagal ngirim email. Coba lagi bentar ya." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
