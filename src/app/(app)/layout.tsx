import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authDisabled } from "@/lib/auth-bypass";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proxy already guards this, but keep the layout self-contained.
  if (!user && !authDisabled) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <span className="font-semibold">MyFulus</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <form action={signOut}>
            <button className="px-2 text-sm text-text-muted">Keluar</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 p-4">{children}</main>

      <BottomNav />
    </div>
  );
}
