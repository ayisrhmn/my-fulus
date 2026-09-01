import { type HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-border bg-surface p-4 shadow-sm dark:shadow-none ${className}`}
      {...props}
    />
  );
}
