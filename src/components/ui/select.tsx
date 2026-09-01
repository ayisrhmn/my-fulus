"use client";

import * as RSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

export type Option = { value: string; label: string };

const field =
  "flex h-11 w-full items-center justify-between rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface px-4 text-base outline-none data-[state=open]:border-primary";

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Pilih…",
  ariaLabel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <RSelect.Root value={value} onValueChange={onValueChange}>
      <RSelect.Trigger className={field} aria-label={ariaLabel}>
        <RSelect.Value placeholder={placeholder} />
        <RSelect.Icon>
          <ChevronDown className="size-4 text-text-muted" />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-64 w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-[var(--radius-sm)] border-[length:var(--border-w)] border-border bg-surface shadow-[var(--shadow-retro)]"
        >
          <RSelect.Viewport className="p-1">
            {options.map((o) => (
              <RSelect.Item
                key={o.value}
                value={o.value}
                className="flex cursor-pointer items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-[15px] outline-none data-[highlighted]:bg-surface-2"
              >
                <RSelect.ItemText>{o.label}</RSelect.ItemText>
                <RSelect.ItemIndicator>
                  <Check className="size-4 text-primary" />
                </RSelect.ItemIndicator>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}
