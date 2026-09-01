"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sheet } from "@/components/ui/sheet";
import { TransactionForm } from "./transaction-form";
import { getTransaction } from "./actions";
import type { Category, TransactionWithCategory } from "@/lib/types";

function EditBody({
  id,
  categories,
  onDone,
}: {
  id: string;
  categories: Category[];
  onDone: () => void;
}) {
  const [tx, setTx] = useState<TransactionWithCategory | null | undefined>(
    undefined,
  );

  useEffect(() => {
    let alive = true;
    getTransaction(id).then((t) => {
      if (alive) setTx(t);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  if (tx === undefined)
    return <p className="text-sm text-text-muted">Memuat…</p>;
  if (tx === null)
    return <p className="text-sm text-danger">Transaksi nggak ketemu.</p>;

  return (
    <TransactionForm categories={categories} transaction={tx} onDone={onDone} />
  );
}

export function TransactionSheet({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const sheet = params.get("sheet");
  const open = sheet != null;

  function close() {
    router.replace("/transactions");
  }
  function done() {
    close();
    router.refresh();
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => !o && close()}
      title={sheet && sheet !== "new" ? "Ubah transaksi" : "Transaksi baru"}
    >
      {open &&
        (sheet === "new" ? (
          <TransactionForm key="new" categories={categories} onDone={done} />
        ) : (
          <EditBody key={sheet} id={sheet!} categories={categories} onDone={done} />
        ))}
    </Sheet>
  );
}
