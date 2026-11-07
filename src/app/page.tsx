import type { Metadata } from "next";
import Link from "next/link";
import { getClosingSoon, getFeatured, getAggregateStats, FAQS } from "@/data";
import { HeroMotion } from "@/components/landing/HeroMotion";
import { StatStrip } from "@/components/landing/StatStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ScholarshipCard } from "@/components/scholarship/ScholarshipCard";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookmarkCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Grantly - Find scholarships that fit you",
  description:
    "Discover verified scholarships, match your academic profile, and track application deadlines with zero accounts or tracking.",
};

export default function HomePage() {
  const stats = getAggregateStats();
  const closingSoonScholarships = getClosingSoon(6);
  const featuredScholarships = getFeatured();

  const comparisonRows = [
    {
      problem: "Scattered Aggregators & Dead Links",
      problemDetail:
        "Students waste 30+ hours trawling unverified portals with broken URLs, expired programs, and sponsored spam entries.",
      solution: "Verified Single-Source Directory",
      solutionDetail:
        "30+ hand-curated scholarship records with confirmed dates, direct provider application portals, and clear award terms.",
    },
    {
      problem: "Ambiguous Eligibility & Disqualification",
      problemDetail:
        "Applying blindly to programs only to be rejected over fine-print GPA formulas, residency clauses, or study-level restrictions.",
      solution: "Deterministic Fit Scoring",
      solutionDetail:
        "Instant 0–100% profile matching breaking down degree level, field, country, GPA, and financial need with transparent reasons.",
    },
    {
      problem: "Missed Deadlines & Lost Document Checklists",
      problemDetail:
        "Tracking essays, transcripts, and recommendation letters across scattered spreadsheets and browser tabs leads to missed cutoffs.",
      solution: "Local-First Application Kanban",
      solutionDetail:
        "In-browser stage tracking from Saved to Applied, with dedicated document checklists and real-time deadline counters.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 py-8 sm:gap-28 sm:py-12 lg:py-16">
      {/* 1. Hero Section with subtle paper-like accent gradient */}
      <section className="relative overflow-hidden pt-4 pb-8 sm:pb-12 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--accent)_6%,var(--background))_0%,var(--background)_70%)]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <HeroMotion />
        </div>
      </section>

      {/* 2. Stat Strip Section */}
      <section
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Overview Statistics"
      >
        <StatStrip
          count={stats.count}
          totalFundingUSD={stats.totalFundingUSD}
          closingThisMonth={stats.closingThisMonth}
        />
      </section>

      {/* 3. How It Works Section */}
      <section
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="how-it-works-heading"
      >
        <div className="flex flex-col items-center gap-3 text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground">
            <Sparkles className="size-3.5 text-accent" />
            <span>Structured Process</span>
          </div>
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
          >
            How Grantly works<span className="text-accent">.</span>
          </h2>
          <p className="max-w-xl text-base text-muted-foreground">
            A three-step workflow designed to take you from discovery to complete submission without cognitive overload.
          </p>
        </div>

        <HowItWorks />
      </section>

      {/* 4. Closing Soon Section */}
      <section
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="closing-soon-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
              <Clock className="size-3.5 text-accent" aria-hidden="true" />
              <span>Upcoming Deadlines</span>
            </div>
            <h2
              id="closing-soon-heading"
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground"
            >
              Closing soon
            </h2>
            <p className="text-sm text-muted-foreground">
              Prioritize your application timeline with funding programs ending in the coming weeks.
            </p>
          </div>

          <Link
            href="/discover?sort=deadline-soonest"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-[44px] self-start sm:self-auto gap-2 border-border text-foreground hover:bg-muted"
            )}
          >
            <span>View all closing soon</span>
            <ArrowRight className="size-4 text-accent" />
          </Link>
        </div>

        {/* Snap-scroll list on mobile / Grid on desktop */}
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
          {closingSoonScholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="w-[85vw] max-w-sm shrink-0 snap-center md:w-auto"
            >
              <ScholarshipCard scholarship={scholarship} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Scholarships Section */}
      <section
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="featured-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
              <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
              <span>High Impact Awards</span>
            </div>
            <h2
              id="featured-heading"
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground"
            >
              Featured scholarships
            </h2>
            <p className="text-sm text-muted-foreground">
              Flagship fellowships, full rides, and competitive research bursaries curated for high impact.
            </p>
          </div>

          <Link
            href="/discover"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-[44px] self-start sm:self-auto gap-2 border-border text-foreground hover:bg-muted"
            )}
          >
            <span>Explore all scholarships</span>
            <ArrowRight className="size-4 text-accent" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredScholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      </section>

      {/* 6. Why Students Lose Out (Problem -> Solution) */}
      <section
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="why-lose-out-heading"
      >
        <div className="flex flex-col items-center gap-3 text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground">
            <AlertCircle className="size-3.5 text-accent" />
            <span>The Reality of Funding</span>
          </div>
          <h2
            id="why-lose-out-heading"
            className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
          >
            Why students lose out &bull; How Grantly fixes it
          </h2>
          <p className="max-w-xl text-base text-muted-foreground">
            Every year, billions in scholarship funding go unclaimed due to fragmented information and organizational barriers.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {comparisonRows.map((row, index) => (
            <div
              key={row.problem}
              className="grid grid-cols-1 divide-y divide-border rounded-2xl border border-border bg-card shadow-card lg:grid-cols-2 lg:divide-x lg:divide-y-0"
            >
              {/* Problem Column */}
              <div className="flex flex-col gap-2 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    The Problem
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {row.problem}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {row.problemDetail}
                </p>
              </div>

              {/* Solution Column */}
              <div className="flex flex-col gap-2 p-6 sm:p-8 bg-muted/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
                  <span className="text-xs uppercase tracking-wider text-foreground font-bold">
                    How Grantly Fixes It
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {row.solution}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {row.solutionDetail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section
        className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8"
        aria-labelledby="faq-heading"
      >
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <h2
            id="faq-heading"
            className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
          >
            Frequently asked questions
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Clear, transparent answers on how Grantly protects your privacy and simplifies your search.
          </p>
        </div>

        <LandingFaq items={FAQS} />
      </section>

      {/* 8. Final CTA Band (Accent Fill) */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-accent p-8 sm:p-14 text-center text-accent-foreground shadow-card flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-foreground/30 bg-transparent px-3.5 py-1 text-xs font-semibold text-accent-foreground">
            <BookmarkCheck className="size-4" />
            <span>Ready for your next application cycle</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-accent-foreground max-w-2xl leading-[1.15]">
            Start discovering scholarships tailored to your exact profile.
          </h2>

          <p className="text-base sm:text-lg text-accent-foreground max-w-xl leading-relaxed">
            No signup barriers, no advertisements. Save opportunities, check off your application requirements, and never miss a deadline.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/discover"
              className={cn(
                buttonVariants({ variant: "default" }),
                "min-h-[48px] rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <span>Explore 30+ Scholarships</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/tracker"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "min-h-[48px] rounded-xl border-accent-foreground/30 bg-transparent px-6 text-base font-semibold text-accent-foreground hover:bg-accent-foreground/10"
              )}
            >
              <span>Open Application Tracker</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
