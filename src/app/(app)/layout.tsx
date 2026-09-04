import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/toaster";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Proxy already guards this, but keep the layout self-contained.
  if (!user) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold">
          MyFulus
        </span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/settings"
            aria-label="Pengaturan"
            className="flex size-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-2"
          >
            <Settings className="size-[18px]" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 p-4">{children}</main>

      <BottomNav />
      <Toaster />
    </div>
  );
}
