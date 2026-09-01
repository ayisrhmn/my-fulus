"use client";

import { useState, useTransition } from "react";
import { signOut } from "@/app/(app)/actions";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2 text-sm font-medium text-danger"
      >
        Keluar
      </button>

      <Sheet open={open} onOpenChange={setOpen} title="Keluar dari MyFulus?">
        <div className="space-y-4">
          <p className="text-[13px] text-text-muted">
            Kamu bakal balik ke halaman login. Data kamu aman, tinggal masuk
            lagi kapan aja.
          </p>
          <div className="space-y-2">
            <Button
              type="button"
              variant="danger"
              disabled={pending}
              className="w-full"
              onClick={() => startTransition(() => signOut())}
            >
              {pending ? "Keluar…" : "Keluar"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
}
