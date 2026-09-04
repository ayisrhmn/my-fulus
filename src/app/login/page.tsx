"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 py-3 text-base outline-none focus:border-primary";

type EmailForm = { email: string };
type CodeForm = { code: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const emailForm = useForm<EmailForm>({ defaultValues: { email: "" } });
  const codeForm = useForm<CodeForm>({ defaultValues: { code: "" } });
  const [serverError, setServerError] = useState("");

  async function requestCode({ email }: EmailForm) {
    setServerError("");
    const res = await fetch("/api/auth/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "" }));
      setServerError(error || "Gagal ngirim kode. Coba lagi ya.");
      return;
    }
    setEmail(email.trim().toLowerCase());
  }

  async function submitCode({ code }: CodeForm) {
    setServerError("");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "" }));
      setServerError(error || "Kode salah. Coba lagi ya.");
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  function resetToEmail() {
    setServerError("");
    codeForm.reset();
    setEmail("");
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold">MyFulus</h1>

        {!email ? (
          <form
            onSubmit={emailForm.handleSubmit(requestCode)}
            className="space-y-4"
          >
            <p className="text-sm text-text-muted">
              Masukin email kamu, nanti kita kirim kode buat masuk.
            </p>
            <input
              type="email"
              autoFocus
              placeholder="email kamu"
              className={inputClass}
              {...emailForm.register("email", {
                required: "Email wajib diisi.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format email nggak valid.",
                },
              })}
            />
            {emailForm.formState.errors.email && (
              <p className="text-sm text-danger">
                {emailForm.formState.errors.email.message}
              </p>
            )}
            <Button
              type="submit"
              disabled={emailForm.formState.isSubmitting}
              className="w-full"
            >
              {emailForm.formState.isSubmitting ? "Lagi ngirim…" : "Kirim kode"}
            </Button>
            {serverError && (
              <p className="text-sm text-danger">{serverError}</p>
            )}
          </form>
        ) : (
          <form
            onSubmit={codeForm.handleSubmit(submitCode)}
            className="space-y-4"
          >
            <p className="text-sm text-text-muted">
              Kode 6 digit udah dikirim ke <strong>{email}</strong>. Cek email
              kamu ya.
            </p>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={6}
              placeholder="000000"
              className={`${inputClass} tracking-[0.5em]`}
              {...codeForm.register("code", {
                required: "Kode wajib diisi.",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Kode harus 6 digit angka.",
                },
              })}
            />
            {codeForm.formState.errors.code && (
              <p className="text-sm text-danger">
                {codeForm.formState.errors.code.message}
              </p>
            )}
            <Button
              type="submit"
              disabled={codeForm.formState.isSubmitting}
              className="w-full"
            >
              {codeForm.formState.isSubmitting ? "Ngecek…" : "Masuk"}
            </Button>
            {serverError && (
              <p className="text-sm text-danger">{serverError}</p>
            )}
            <button
              type="button"
              onClick={resetToEmail}
              className="w-full text-sm text-text-muted underline"
            >
              Ganti email / kirim ulang kode
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
