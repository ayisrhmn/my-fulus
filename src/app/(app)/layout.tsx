import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  // Middleware already guards this, but keep the layout self-contained.
  if (!user) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="font-semibold">MyFulus</span>
        <form action={signOut}>
          <button className="text-sm text-zinc-500">Sign out</button>
        </form>
      </header>
      <main className="flex flex-1 flex-col p-4">{children}</main>
    </div>
  );
}
