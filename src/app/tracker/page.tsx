import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getAll } from "@/data";
import { TrackerSkeleton } from "@/components/tracker/TrackerSkeleton";
import { TrackerHeaderActions } from "@/components/tracker/TrackerBoard";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Tracker",
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
      {/* Server Shell: Top Action Header Bar (guarantees H1, explanation, and action buttons in raw server HTML) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              My Application Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your saved programs, document preparation checklists, notes, and deadlines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Link
            href="/discover"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-h-[40px] gap-1.5 border-border text-xs font-semibold text-foreground hover:bg-muted"
            )}
          >
            <Compass className="size-3.5 text-accent" />
            <span>Browse Directory</span>
          </Link>

          <TrackerHeaderActions />
        </div>
      </div>

      {/* Lazy-Loaded Board with Sized 4-Column Placeholder */}
      <TrackerBoard scholarships={scholarships} hideHeader />
    </div>
  );
}
