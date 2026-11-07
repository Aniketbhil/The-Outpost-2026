import type { Metadata } from "next";
import Link from "next/link";
import { getAll } from "@/data";
import { ScholarshipCard } from "@/components/scholarship/ScholarshipCard";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover Scholarships - Grantly",
  description: "Browse and filter 30+ verified institutional scholarships.",
};

export default function DiscoverPage() {
  const scholarships = getAll();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Discover Scholarships
          </h1>
          <span className="text-sm font-medium text-muted-foreground">
            {scholarships.length} verified programs
          </span>
        </div>
        <p className="max-w-2xl text-base text-muted-foreground">
          Explore global and national opportunities with transparent eligibility criteria, full funding terms, and verified deadline timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>
    </div>
  );
}
