import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-xl font-semibold">Pengaturan</h1>
      <div className="space-y-2">
        <Skeleton className="h-[58px] w-full" />
        <Skeleton className="h-[58px] w-full" />
      </div>
    </div>
  );
}
