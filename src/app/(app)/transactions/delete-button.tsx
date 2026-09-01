"use client";

import { deleteTransaction } from "./actions";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteTransaction}
      onSubmit={(e) => {
        if (!confirm("Hapus transaksi ini?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="danger" className="w-full">
        Hapus
      </Button>
    </form>
  );
}
