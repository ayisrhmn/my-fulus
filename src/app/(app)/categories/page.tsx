import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ChevronRight, Lock, Tags } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Fab } from "@/components/ui/fab";
import { CategoryIcon } from "@/components/category-icon";
import { SheetLink } from "@/components/sheet-link";
import { CategorySheet } from "./category-sheet";
import type { Category } from "@/lib/types";

function Group({ title, items }: { title: string; items: Category[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-[13px] font-medium text-text-muted">{title}</h2>
      {items.map((c) => {
        const custom = c.user_id != null;
        const row = (
          <Card className="flex items-center gap-3">
            <CategoryIcon name={c.icon} />
            <span className="flex-1 font-medium">{c.name}</span>
            {custom ? (
              <ChevronRight className="size-4 shrink-0 text-text-muted" />
            ) : (
              <Lock className="size-4 shrink-0 text-text-muted" />
            )}
          </Card>
        );
        return custom ? (
          <SheetLink
            key={c.id}
            basePath="/categories"
            sheet={c.id}
            className="block"
          >
            {row}
          </SheetLink>
        ) : (
          <div key={c.id}>{row}</div>
        );
      })}
    </section>
  );
}

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const categories = await getCategories(user.id);
  const income = categories.filter((c) => c.type === "income");
  const expense = categories.filter((c) => c.type === "expense");

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-xl font-semibold">Kategori</h1>

      {categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="Kategori masih kosong"
          description="Belum ada kategori sama sekali. Bikin satu buat mulai milah transaksi."
          action={
            <SheetLink basePath="/categories" sheet="new">
              <Button>Tambah kategori</Button>
            </SheetLink>
          }
        />
      ) : (
        <>
          <Group title="Pengeluaran" items={expense} />
          <Group title="Pemasukan" items={income} />
        </>
      )}

      <Fab basePath="/categories" label="Tambah" />
      <Suspense>
        <CategorySheet categories={categories} />
      </Suspense>
    </div>
  );
}
