import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight, Lock, Tags } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Fab } from "@/components/ui/fab";
import { CategoryIcon } from "@/components/category-icon";
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
          <Link key={c.id} href={`/categories?sheet=${c.id}`} scroll={false}>
            {row}
          </Link>
        ) : (
          <div key={c.id}>{row}</div>
        );
      })}
    </section>
  );
}

export default async function CategoriesPage() {
  const categories = await getCategories();
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
            <Link href="/categories?sheet=new" scroll={false}>
              <Button>Tambah kategori</Button>
            </Link>
          }
        />
      ) : (
        <>
          <Group title="Pengeluaran" items={expense} />
          <Group title="Pemasukan" items={income} />
        </>
      )}

      <Fab href="/categories?sheet=new" label="Tambah" />
      <Suspense>
        <CategorySheet categories={categories} />
      </Suspense>
    </div>
  );
}
