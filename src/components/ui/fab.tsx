import Link from "next/link";
import { Plus } from "lucide-react";

export function Fab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="fixed right-4 bottom-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] z-20 flex h-14 items-center gap-1 rounded-full border-[length:var(--border-w)] border-border bg-primary pr-5 pl-4 font-medium text-primary-fg shadow-[var(--shadow-retro)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    >
      <Plus className="size-5" />
      {label}
    </Link>
  );
}
