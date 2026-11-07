import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Tracker - Grantly",
  description: "Track and organize your scholarship applications and checklists.",
};

export default function TrackerPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Discover</span>
        </Link>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Scholarship Application Tracker
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl">
          Manage your saved scholarships, deadlines, application stages, and document checklists.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 mb-4">
          <Sparkles className="size-6 text-accent" />
        </div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
          Tracker Workspace Ready
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          The tracker store and local persistence layer are initialized. Full board and list views will be populated in subsequent tasks.
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          Explore Discover Page
        </Link>
      </div>
    </div>
  );
}
