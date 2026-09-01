"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { id as idLocale } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/format";
import "react-day-picker/style.css";

// value / onChange use ISO date strings (yyyy-mm-dd).
export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value) : undefined;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="flex h-11 w-full items-center justify-between rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 text-base outline-none data-[state=open]:border-primary">
        {selected ? formatDate(value) : "Pilih tanggal"}
        <CalendarDays className="size-4 text-text-muted" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={4}
          className="z-50 rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface p-2 shadow-[var(--shadow-retro)]"
        >
          <DayPicker
            mode="single"
            locale={idLocale}
            defaultMonth={selected}
            selected={selected}
            onSelect={(d) => {
              if (d) {
                const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
                onChange(local.toISOString().slice(0, 10));
              }
              setOpen(false);
            }}
            style={
              {
                "--rdp-accent-color": "var(--color-primary)",
                "--rdp-accent-background-color": "var(--color-surface-2)",
              } as React.CSSProperties
            }
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
