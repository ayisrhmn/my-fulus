import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Ringkasan</h1>
      <p className="text-[13px] text-text-muted">Login sebagai {user?.email}</p>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-[13px] text-text-muted">Pemasukan</p>
          <p className="mt-1 font-mono text-lg font-bold text-income">Rp0</p>
        </Card>
        <Card>
          <p className="text-[13px] text-text-muted">Pengeluaran</p>
          <p className="mt-1 font-mono text-lg font-bold text-expense">Rp0</p>
        </Card>
      </div>
      <Card>
        <p className="text-[13px] text-text-muted">Saldo bulan ini</p>
        <p className="mt-1 font-mono text-2xl font-bold">Rp0</p>
      </Card>

      {/* ponytail: angka masih dummy — diisi dari query di Phase 7 */}
    </div>
  );
}
