"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Sheet } from "@/components/ui/sheet";
import { CategoryForm } from "./category-form";
import type { Category } from "@/lib/types";

export function CategorySheet({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const sheet = params.get("sheet");

  const open = sheet != null;
  const category =
    sheet && sheet !== "new"
      ? categories.find((c) => c.id === sheet)
      : undefined;

  function close() {
    router.replace("/categories");
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => !o && close()}
      title={category ? "Ubah kategori" : "Kategori baru"}
    >
      {open && (
        <CategoryForm
          key={sheet}
          category={category}
          onDone={() => {
            close();
            router.refresh();
          }}
        />
      )}
    </Sheet>
  );
}
