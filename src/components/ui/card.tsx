import { type HTMLAttributes } from "react";

export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[var(--radius)] border-[length:var(--border-w)] border-border bg-surface p-4 shadow-[var(--shadow-retro)] ${className}`}
      {...props}
    />
  );
}
