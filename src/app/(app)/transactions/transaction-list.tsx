"use client";

import { useEffect, useRef, useState } from "react";
import { loadMoreTransactions } from "./actions";
import { PAGE_SIZE, type TransactionFilters } from "./constants";
import { TransactionRow } from "@/components/transaction-row";
import { formatDateHeader } from "@/lib/format";
import type { TransactionWithCategory } from "@/lib/types";

function groupByDate(rows: TransactionWithCategory[]) {
  const out: { date: string; items: TransactionWithCategory[] }[] = [];
  for (const r of rows) {
    const last = out[out.length - 1];
    if (last && last.date === r.date) last.items.push(r);
    else out.push({ date: r.date, items: [r] });
  }
  return out;
}

export function TransactionList({
  initialRows,
  filters,
  initialHasMore,
}: {
  initialRows: TransactionWithCategory[];
  filters: TransactionFilters;
  initialHasMore: boolean;
}) {
  const [rows, setRows] = useState(initialRows);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const { from, to, cat } = filters;

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;

    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || loading) return;
        setLoading(true);
        const next = await loadMoreTransactions({ from, to, cat }, rows.length);
        setRows((r) => [...r, ...next]);
        setHasMore(next.length === PAGE_SIZE);
        setLoading(false);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, rows.length, from, to, cat]);

  const groups = groupByDate(rows);

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <section key={g.date} className="space-y-2">
          <h2 className="text-[13px] font-medium text-text-muted">
            {formatDateHeader(g.date)}
          </h2>
          <ul className="space-y-2">
            {g.items.map((t) => (
              <li key={t.id}>
                <TransactionRow tx={t} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {hasMore && <div ref={sentinel} className="h-8" />}
      {loading && (
        <p className="text-center text-[13px] text-text-muted">Memuat…</p>
      )}
    </div>
  );
}
