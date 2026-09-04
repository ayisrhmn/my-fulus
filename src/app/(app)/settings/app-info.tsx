"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { SettingsRow } from "./settings-row";

export function AppInfo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SettingsRow
        icon={Info}
        label="Info aplikasi"
        onClick={() => setOpen(true)}
      />
      <Sheet open={open} onOpenChange={setOpen} title="Info aplikasi">
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
            MyFulus
          </p>
          <p className="text-[13px] text-text-muted">
            Pencatat keuangan pribadi kamu.
          </p>
          <p className="pt-2 font-mono text-[13px] text-text-muted">
            Versi {process.env.NEXT_PUBLIC_APP_VERSION}
          </p>
        </div>
      </Sheet>
    </>
  );
}
