import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAll } from "@/data";
import { TrackerSkeleton } from "@/components/tracker/TrackerSkeleton";

export const metadata: Metadata = {
  title: "My Tracker - Grantly",
  description:
    "Track your saved scholarships, assemble document checklists, monitor deadlines, and record application notes locally in your browser.",
};

const TrackerBoard = dynamic(
  () =>
    import("@/components/tracker/TrackerBoard").then((mod) => mod.TrackerBoard),
  {
    loading: () => <TrackerSkeleton />,
  }
);

export default function TrackerPage() {
  const scholarships = getAll();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <TrackerBoard scholarships={scholarships} />
    </div>
  );
}
