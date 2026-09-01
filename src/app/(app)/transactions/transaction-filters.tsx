"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { monthBounds, detectPreset, type RangePreset } from "@/lib/date-range";
import type { Category } from "@/lib/types";

const presets: { key: RangePreset; label: string }[] = [
  { key: "this", label: "Bulan ini" },
  { key: "last", label: "Bulan lalu" },
  { key: "custom", label: "Custom" },
];

export function TransactionFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const def = monthBounds(0);
  const from = params.get("from") ?? def.from;
  const to = params.get("to") ?? def.to;
  const cat = params.get("cat") ?? "";
  const preset = detectPreset(from, to);

  function apply(next: Record<string, string | null>) {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v == null || v === "") p.delete(k);
      else p.set(k, v);
    }
    router.push(`/transactions?${p.toString()}`, { scroll: false });
  }

  function pickPreset(key: RangePreset) {
    if (key === "this") apply({ from: null, to: null });
    else if (key === "last") apply(monthBounds(-1));
    else apply({ from, to }); // switch to custom, keep current dates editable
  }

  const catOptions = [
    { value: "", label: "Semua kategori" },
    { value: "none", label: "Tanpa kategori" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => pickPreset(p.key)}
            className={`rounded-full border-[length:var(--border-w)] border-border px-3 py-1.5 text-[13px] font-medium ${
              preset === p.key ? "bg-primary text-primary-fg" : "bg-surface"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="grid grid-cols-2 gap-2">
          <DatePicker value={from} onChange={(v) => apply({ from: v, to })} />
          <DatePicker value={to} onChange={(v) => apply({ from, to: v })} />
        </div>
      )}

      <Select
        ariaLabel="Filter kategori"
        value={cat}
        onValueChange={(v) => apply({ cat: v })}
        options={catOptions}
      />
    </div>
  );
}
