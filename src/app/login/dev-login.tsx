"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

// Dev-only password login. Bypasses the magic-link email rate limit.
// Create the user first: Supabase dashboard > Authentication > Users > Add user
// (set a password, enable "Auto Confirm User").
export function DevLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setBusy(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace("/dashboard");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 border-t-[length:var(--border-w)] border-border pt-6"
    >
      <p className="text-[13px] text-text-muted">Dev login (password)</p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 py-3 text-base outline-none focus:border-primary"
      />
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        className="w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 py-3 text-base outline-none focus:border-primary"
      />
      <Button type="submit" variant="ghost" disabled={busy} className="w-full">
        {busy ? "Masuk…" : "Masuk (dev)"}
      </Button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  );
}
