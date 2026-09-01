export const metadata = { title: "Offline — MyFulus" };

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-xl font-semibold">Lagi offline</h1>
      <p className="max-w-xs text-[13px] text-text-muted">
        Kamu nggak ada koneksi. Halaman ini kebuka dari cache. Coba lagi kalau
        internet udah balik.
      </p>
    </main>
  );
}
