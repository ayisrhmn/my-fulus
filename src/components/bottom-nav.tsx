"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, NotebookPen, Tags, type LucideIcon } from "lucide-react";

const items: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Ringkasan", icon: House },
  { href: "/transactions", label: "Transaksi", icon: NotebookPen },
  { href: "/categories", label: "Kategori", icon: Tags },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex h-14 flex-col items-center justify-center gap-1 text-[11px] ${
                  active ? "text-primary" : "text-text-muted"
                }`}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
