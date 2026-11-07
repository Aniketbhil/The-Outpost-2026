import { TrackerSkeleton } from "@/components/tracker/TrackerSkeleton";

export default function TrackerLoading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <TrackerSkeleton />
    </div>
  );
}
