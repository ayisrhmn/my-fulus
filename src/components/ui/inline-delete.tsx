"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// Two-step delete: the button morphs into a confirm + cancel pair on first tap.
export function InlineDelete({
  onConfirm,
  label = "Hapus",
}: {
  onConfirm: () => Promise<void>;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="danger"
        className="w-full"
        onClick={() => setConfirming(true)}
      >
        {label}
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="danger"
        disabled={busy}
        className="flex-1"
        onClick={async () => {
          setBusy(true);
          await onConfirm();
          setBusy(false);
        }}
      >
        {busy ? "Menghapus…" : "Hapus beneran?"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        disabled={busy}
        onClick={() => setConfirming(false)}
      >
        Batal
      </Button>
    </div>
  );
}
