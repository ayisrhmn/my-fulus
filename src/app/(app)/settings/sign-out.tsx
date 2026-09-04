"use client";

import { useState, useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/(app)/actions";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SettingsRow } from "./settings-row";

export function SignOut() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <SettingsRow
        icon={LogOut}
        label="Keluar"
        danger
        onClick={() => setOpen(true)}
      />

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
