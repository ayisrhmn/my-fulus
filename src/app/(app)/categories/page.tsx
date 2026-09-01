import { Suspense } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { Card } from "@/components/ui/card";
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
              <span className="text-[13px] text-text-muted">Ubah</span>
            ) : (
              <span className="text-[13px] text-text-muted">Bawaan</span>
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
      <Group title="Pengeluaran" items={expense} />
      <Group title="Pemasukan" items={income} />

      <Fab href="/categories?sheet=new" label="Tambah" />
      <Suspense>
        <CategorySheet categories={categories} />
      </Suspense>
    </div>
  );
}
