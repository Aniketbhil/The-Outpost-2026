import type { Metadata } from "next";
import { Suspense } from "react";
import { getAll } from "@/data";
import { DiscoverExplorer } from "@/components/discover/DiscoverExplorer";
import { DiscoverSkeleton } from "@/components/discover/DiscoverSkeleton";

export const metadata: Metadata = {
  title: "Discover Scholarships",
  description:
    "Explore 30+ verified institutional scholarships with real-time profile matching, custom filter controls, and dead-accurate eligibility criteria.",
};

export default function DiscoverPage() {
  const scholarships = getAll();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Shell Heading (Server Component) */}
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Discover Scholarships<span className="text-accent">.</span>
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Filter verified institutional and foundation opportunities by education level, discipline, citizenship, and award type.
        </p>
      </div>

      {/* Interactive Explorer wrapped in Suspense with Real Server-Rendered Grid Fallback */}
      <Suspense fallback={<DiscoverSkeleton scholarships={scholarships.slice(0, 12)} />}>
        <DiscoverExplorer scholarships={scholarships} />
      </Suspense>
    </div>
  );
}
