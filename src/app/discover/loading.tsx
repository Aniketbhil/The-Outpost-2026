import { DiscoverSkeleton } from "@/components/discover/DiscoverSkeleton";

export default function DiscoverLoading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-2">
        <div className="h-10 w-72 rounded-lg bg-muted animate-pulse" />
        <div className="h-5 w-96 rounded-lg bg-muted animate-pulse" />
      </div>
      <DiscoverSkeleton />
    </div>
  );
}
