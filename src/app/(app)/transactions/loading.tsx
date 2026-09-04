import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-xl font-semibold">Transaksi</h1>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-[66px] w-full" />
        ))}
      </div>
    </div>
  );
}
