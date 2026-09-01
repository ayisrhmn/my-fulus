import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Ringkasan</h1>
      <p className="text-sm text-zinc-500">Login sebagai {user?.email}</p>
      {/* ponytail: placeholder — total & chart nyusul di Phase 5+ */}
    </div>
  );
}
