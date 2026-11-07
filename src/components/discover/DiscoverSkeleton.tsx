import type { Scholarship } from "@/lib/types";
import { getAll } from "@/data";
import { ScholarshipCard } from "@/components/scholarship/ScholarshipCard";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DiscoverSkeleton({ scholarships }: { scholarships?: Scholarship[] }) {
  const defaultItems = scholarships || getAll().slice(0, 12);

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner: Match CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-accent/40 bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">
              Personalized Match Engine
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Answer 4 quick questions (GPA, field, education level) to calculate real-time match scores without an account.
            </p>
          </div>
        </div>
        <Button className="min-h-[44px] gap-2 bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 self-start sm:self-auto">
          <Sparkles className="size-4 text-accent" />
          <span>Find My Matches</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Shell */}
        <aside
          aria-label="Filter sidebar"
          className="hidden lg:flex w-72 shrink-0 flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-accent" />
              <h2 className="font-heading text-base font-bold text-foreground">
                Filter Programs
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-xs text-muted-foreground">
            <div className="flex flex-col gap-1.5">
              <span className="font-bold uppercase tracking-wider text-muted-foreground">Study Level</span>
              <span className="text-foreground">All levels (High School, Undergraduate, Postgraduate, PhD)</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-bold uppercase tracking-wider text-muted-foreground">Academic Field</span>
              <span className="text-foreground">All disciplines (STEM, Business, Medicine, Law, Arts)</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-bold uppercase tracking-wider text-muted-foreground">Citizenship</span>
              <span className="text-foreground">Global, India, USA, UK, Germany, Canada</span>
            </div>
          </div>
        </aside>

        {/* Results Grid with Real Server-Rendered Cards */}
        <main className="flex-1 w-full flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <span className="text-sm font-semibold text-foreground">
              Showing 12 of 30 scholarships
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {defaultItems.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              variant="outline"
              className="min-h-[44px] gap-2 rounded-xl border-border px-8 text-sm font-semibold text-foreground"
            >
              <span>Load more (18 remaining)</span>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
