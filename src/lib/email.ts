import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendLoginCode(email: string, code: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `Kode masuk MyFulus: ${code}`,
    text: [
      `Kode buat masuk ke MyFulus kamu: ${code}`,
      "",
      "Berlaku 10 menit. Kalau kamu nggak minta ini, abaikan aja.",
    ].join("\n"),
  });
  if (error) throw new Error(error.message);
}
