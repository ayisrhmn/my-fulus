"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type FormValues = { email: string };

export default function LoginPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { email: "" } });

  async function onSubmit({ email }: FormValues) {
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) setServerError(error.message);
    else setSent(true);
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold">MyFulus</h1>

        {sent ? (
          <p className="text-sm text-text-muted">
            Cek email kamu ya, link buat masuk udah dikirim.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="email"
              autoFocus
              placeholder="email kamu"
              className="w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 py-3 text-base outline-none focus:border-primary"
              {...register("email", {
                required: "Email wajib diisi.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format email nggak valid.",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-danger">{errors.email.message}</p>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Lagi ngirim…" : "Kirim magic link"}
            </Button>
            {serverError && (
              <p className="text-sm text-danger">Yah, gagal ngirim: {serverError}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
