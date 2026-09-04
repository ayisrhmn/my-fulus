import { Suspense } from "react";
import { getCategories } from "@/lib/queries";
import { monthBounds } from "@/lib/date-range";
import { Skeleton } from "@/components/ui/skeleton";
import { Fab } from "@/components/ui/fab";
import { TransactionFilters } from "./transaction-filters";
import { TransactionContent } from "./transaction-content";
import { TransactionSheet } from "./transaction-sheet";

type SearchParams = {
  from?: string;
  to?: string;
  cat?: string;
  range?: string;
  sheet?: string;
};

function ContentSkeleton() {
  return (
    <>
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-[66px] w-full" />
        ))}
      </div>
    </>
  );
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const def = monthBounds(0);
  const from = sp.from ?? def.from;
  const to = sp.to ?? def.to;
  const cat = sp.cat ?? "";
  const filtered = sp.from != null || sp.to != null || cat !== "";
  const filterKey = `${from}|${to}|${cat}`;

  const categories = await getCategories();

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-xl font-semibold">Transaksi</h1>

      <Suspense>
        <TransactionFilters categories={categories} />
      </Suspense>

      <Suspense key={filterKey} fallback={<ContentSkeleton />}>
        <TransactionContent from={from} to={to} cat={cat} filtered={filtered} />
      </Suspense>

      <Fab basePath="/transactions" label="Tambah" />
      <Suspense>
        <TransactionSheet categories={categories} />
      </Suspense>
    </div>
  );
}
