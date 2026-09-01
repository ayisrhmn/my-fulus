"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { DevLogin } from "./dev-login";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold">MyFulus</h1>

        {status === "sent" ? (
          <p className="text-sm text-text-muted">
            Cek email kamu ya, link buat masuk udah dikirim.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email kamu"
              className="w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 py-3 text-base outline-none focus:border-primary"
            />
            <Button type="submit" disabled={status === "sending"} className="w-full">
              {status === "sending" ? "Lagi ngirim…" : "Kirim magic link"}
            </Button>
            {status === "error" && (
              <p className="text-sm text-danger">Yah, gagal ngirim: {error}</p>
            )}
          </form>
        )}

        {process.env.NODE_ENV === "development" && <DevLogin />}
      </div>
    </main>
  );
}
