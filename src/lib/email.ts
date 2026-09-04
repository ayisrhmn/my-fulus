import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// MyFulus "warm retro" palette (see src/app/globals.css). Email clients don't
// support CSS variables, so every value here is a literal and every style is
// inlined. Committed to the light look — email dark-mode handling is unreliable.
const INK = "#2b2118";
const BG = "#f6ecd8";
const SURFACE = "#fffaef";
const SURFACE_2 = "#f0e2c6";
const MUTED = "#7a6a52";

const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";
const MONO = "'SF Mono',SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

const CODE_TTL_MINUTES = 10;

function renderLoginCodeEmail(code: string): { html: string; text: string } {
  const text = [
    `Kode masuk MyFulus: ${code}`,
    "",
    `Masukin kode ini di halaman login. Berlaku ${CODE_TTL_MINUTES} menit.`,
    "Kalau kamu nggak minta ini, abaikan aja email ini.",
  ].join("\n");

  const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>Kode masuk MyFulus</title>
</head>
<body style="margin:0;padding:0;background:${BG};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${BG};">
Kode masuk kamu: ${code}. Berlaku ${CODE_TTL_MINUTES} menit.
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
<tr>
<td align="center" style="padding:40px 16px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:440px;">
<tr>
<td style="font-family:${SERIF};font-size:22px;font-weight:700;color:${INK};padding:0 4px 16px;">
MyFulus
</td>
</tr>

<!-- card, with a hard retro drop shadow faked via the dark wrapper cell -->
<tr>
<td style="background:${INK};padding:0 4px 4px 0;border-radius:12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SURFACE};border:2px solid ${INK};border-radius:10px;">
<tr>
<td style="padding:32px 28px;">

<p style="margin:0 0 8px;font-family:${SANS};font-size:15px;color:${INK};">
Halo,
</p>
<p style="margin:0 0 24px;font-family:${SANS};font-size:15px;line-height:1.5;color:${MUTED};">
Ini kode buat masuk ke akun MyFulus kamu. Masukin di halaman login ya.
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="background:${SURFACE_2};border:2px solid ${INK};border-radius:8px;padding:18px 12px;">
<span style="font-family:${MONO};font-size:34px;font-weight:700;letter-spacing:10px;color:${INK};">
${code}
</span>
</td>
</tr>
</table>

<p style="margin:20px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${MUTED};">
Kode ini berlaku <strong style="color:${INK};">${CODE_TTL_MINUTES} menit</strong>.
Kalau kamu nggak lagi coba masuk, abaikan aja email ini &mdash; nggak ada yang berubah di akun kamu.
</p>

</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:20px 4px 0;font-family:${SANS};font-size:12px;line-height:1.5;color:${MUTED};">
Dikirim otomatis oleh MyFulus. Tombol balas nggak dipantau.
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>`;

  return { html, text };
}

export async function sendLoginCode(email: string, code: string): Promise<void> {
  const { html, text } = renderLoginCodeEmail(code);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `Kode masuk MyFulus: ${code}`,
    html,
    text,
  });
  if (error) throw new Error(error.message);
}
