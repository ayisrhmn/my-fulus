import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border-[length:var(--border-w)] border-dashed border-border bg-surface px-6 py-12 text-center shadow-[var(--shadow-retro)]">
      <span className="flex size-16 rotate-[-4deg] items-center justify-center rounded-[var(--radius)] border-[length:var(--border-w)] border-border bg-accent text-ink">
        <Icon className="size-7" />
      </span>
      <div className="space-y-1">
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
          {title}
        </p>
        <p className="mx-auto max-w-[15rem] text-[13px] text-text-muted">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
