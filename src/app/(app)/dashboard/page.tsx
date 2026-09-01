import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="text-sm text-zinc-500">Signed in as {user?.email}</p>
      {/* ponytail: placeholder — totals and charts land in Phase 5+ */}
    </div>
  );
}
