import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-xl font-semibold">Kategori</h1>
      {[0, 1].map((g) => (
        <section key={g} className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[58px] w-full" />
          ))}
        </section>
      ))}
    </div>
  );
}
