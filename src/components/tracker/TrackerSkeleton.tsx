import { Skeleton } from "@/components/ui/skeleton";

export function TrackerSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <Skeleton className="h-8 w-64 bg-muted" />
        <Skeleton className="h-4 w-96 bg-muted" />
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5"
          >
            <Skeleton className="h-4 w-28 bg-muted" />
            <Skeleton className="h-8 w-20 bg-muted" />
            <Skeleton className="h-3 w-32 bg-muted" />
          </div>
        ))}
      </div>

      {/* Columns skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-4 min-h-[400px]"
          >
            <Skeleton className="h-6 w-32 bg-muted" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-44 w-full rounded-xl bg-card" />
              <Skeleton className="h-44 w-full rounded-xl bg-card" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
