import { Skeleton } from "@/components/ui/skeleton";

export function DiscoverSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Top banner skeleton */}
      <div className="h-24 w-full rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-48 bg-muted" />
            <Skeleton className="h-4 w-72 bg-muted" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg bg-muted" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex w-72 shrink-0 flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-6 w-32 bg-muted" />
          <Skeleton className="h-10 w-full rounded-lg bg-muted" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-8 w-full bg-muted" />
            <Skeleton className="h-8 w-full bg-muted" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28 bg-muted" />
            <Skeleton className="h-8 w-full bg-muted" />
            <Skeleton className="h-8 w-full bg-muted" />
          </div>
        </div>

        {/* Results grid skeleton */}
        <div className="flex-1 w-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36 bg-muted" />
            <Skeleton className="h-9 w-40 rounded-lg bg-muted" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-80 flex-col justify-between rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-28 bg-muted" />
                    <Skeleton className="size-8 rounded-lg bg-muted" />
                  </div>
                  <Skeleton className="h-6 w-full bg-muted" />
                  <Skeleton className="h-4 w-5/6 bg-muted" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-12 w-full rounded-lg bg-muted" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-24 bg-muted" />
                    <Skeleton className="h-4 w-20 bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
