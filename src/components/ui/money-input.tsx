"use client";

const group = new Intl.NumberFormat("id-ID");

// Controlled amount input with thousand separators. Emits a plain number ("" when empty).
export function MoneyInput({
  value,
  onChange,
  autoFocus,
}: {
  value: number | "";
  onChange: (value: number | "") => void;
  autoFocus?: boolean;
}) {
  const display = value === "" ? "" : group.format(value);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-muted">
        Rp
      </span>
      <input
        inputMode="numeric"
        autoFocus={autoFocus}
        value={display}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          onChange(digits === "" ? "" : Number(digits));
        }}
        placeholder="0"
        className="w-full rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface py-3 pr-4 pl-10 text-base font-mono outline-none focus:border-primary"
      />
    </div>
  );
}
