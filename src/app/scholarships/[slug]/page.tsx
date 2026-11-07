import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAll, getBySlug, getRelated } from "@/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DeadlineBadge } from "@/components/scholarship/DeadlineBadge";
import { MatchBadge } from "@/components/scholarship/MatchBadge";
import { ScholarshipCard } from "@/components/scholarship/ScholarshipCard";
import { DetailActions } from "@/components/scholarship/DetailActions";
import { DetailEligibility } from "@/components/scholarship/DetailEligibility";
import { DetailDocuments } from "@/components/scholarship/DetailDocuments";
import { DetailStickyBottom } from "@/components/scholarship/DetailStickyBottom";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Globe,
  Clock,
  FileCheck2,
  Calendar,
  CheckCircle2,
  ListOrdered,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const scholarships = getAll();
  return scholarships.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const scholarship = getBySlug(slug);
  if (!scholarship) return { title: "Scholarship Not Found" };

  return {
    title: scholarship.name,
    description: scholarship.summary,
    openGraph: {
      title: scholarship.name,
      description: scholarship.summary,
      type: "article",
    },
  };
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const scholarship = getBySlug(slug);

  if (!scholarship) {
    notFound();
  }

  const related = getRelated(scholarship.slug, 3);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 pb-28 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to all scholarships</span>
        </Link>
      </nav>

      {/* Program Header */}
      <header className="flex flex-col gap-5 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-accent/40 bg-accent/10 text-xs font-semibold text-foreground"
          >
            {scholarship.coverage}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-md bg-secondary text-xs font-medium text-secondary-foreground"
          >
            {scholarship.level}
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-md bg-secondary text-xs font-medium text-secondary-foreground"
          >
            {scholarship.field}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground pl-1">
            <Globe className="size-3.5 text-accent" />
            <span>{scholarship.country}</span>
          </span>
          <MatchBadge scholarship={scholarship} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-muted-foreground">
            {scholarship.provider}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            {scholarship.name}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl pt-1 leading-relaxed">
            {scholarship.summary}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-accent" />
            <span>Deadline: {formatDate(scholarship.deadline)}</span>
          </div>
          <span>&bull;</span>
          <DeadlineBadge deadline={scholarship.deadline} />
        </div>
      </header>

      {/* Two-Column Layout (Content + Desktop Sticky Summary Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column (8 cols): Overview, Eligibility, Documents, Steps */}
        <main className="flex flex-col gap-10 lg:col-span-8">
          {/* 1. Overview */}
          <section className="flex flex-col gap-4" aria-labelledby="overview-heading">
            <h2
              id="overview-heading"
              className="font-heading text-2xl font-bold text-foreground"
            >
              Program Overview
            </h2>
            <div className="flex flex-col gap-4 text-base text-muted-foreground leading-relaxed">
              {scholarship.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* 2. Eligibility (Checklist compared with saved profile) */}
          <section
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card"
            aria-labelledby="eligibility-heading"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-accent" />
              <h2
                id="eligibility-heading"
                className="font-heading text-2xl font-bold text-foreground"
              >
                Eligibility Requirements
              </h2>
            </div>
            <DetailEligibility scholarship={scholarship} />
          </section>

          {/* 3. Documents You'll Need (Interactive checklist that syncs with tracker) */}
          <section
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card"
            aria-labelledby="documents-heading"
          >
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-5 text-accent" />
              <h2
                id="documents-heading"
                className="font-heading text-2xl font-bold text-foreground"
              >
                Documents You&apos;ll Need
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Prepare these official materials before starting your application. Check off items as you assemble them.
            </p>
            <DetailDocuments scholarship={scholarship} />
          </section>

          {/* 4. Application Steps (Numbered Timeline) */}
          <section
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card"
            aria-labelledby="steps-heading"
          >
            <div className="flex items-center gap-2">
              <ListOrdered className="size-5 text-accent" />
              <h2
                id="steps-heading"
                className="font-heading text-2xl font-bold text-foreground"
              >
                Application Roadmap
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Follow this verified step-by-step procedure to submit your dossier to {scholarship.provider}.
            </p>
            <ol className="flex flex-col gap-4 pt-3">
              {scholarship.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 text-sm sm:text-base text-foreground"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/15 text-xs font-bold text-foreground">
                    {idx + 1}
                  </span>
                  <div className="pt-0.5 leading-relaxed">{step}</div>
                </li>
              ))}
            </ol>
          </section>

          {/* 5. Key Facts Grid */}
          <section className="flex flex-col gap-4" aria-labelledby="key-facts-heading">
            <h2
              id="key-facts-heading"
              className="font-heading text-2xl font-bold text-foreground"
            >
              Key Facts &amp; Award Parameters
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Funding Type
                </span>
                <span className="font-heading text-base font-bold text-foreground">
                  {scholarship.type}
                </span>
                <span className="text-xs text-muted-foreground">
                  {scholarship.coverage}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Renewable Status
                </span>
                <span className="font-heading text-base font-bold text-foreground">
                  {scholarship.renewable ? "Renewable Annually" : "One-Time Award"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {scholarship.renewable ? "Subject to academic standing" : "Lump sum disbursement"}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Minimum GPA Cutoff
                </span>
                <span className="font-heading text-base font-bold text-foreground">
                  {scholarship.minGpa !== null ? `${scholarship.minGpa.toFixed(1)} / 4.0` : "No Cutoff"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {scholarship.minGpa !== null ? "Cumulative threshold" : "Evaluated holistically"}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Estimated Effort
                </span>
                <span className="font-heading text-base font-bold text-foreground">
                  ~{scholarship.estimatedMinutes} minutes
                </span>
                <span className="text-xs text-muted-foreground">
                  Includes essays &amp; forms
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Eligible Region
                </span>
                <span className="font-heading text-base font-bold text-foreground">
                  {scholarship.country}
                </span>
                <span className="text-xs text-muted-foreground">
                  Citizens or residents
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Discipline Scope
                </span>
                <span className="font-heading text-base font-bold text-foreground">
                  {scholarship.field}
                </span>
                <span className="text-xs text-muted-foreground">
                  {scholarship.level} study level
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* Right Column (4 cols): Desktop Sticky Summary Card */}
        <aside
          aria-label="Application action summary"
          className="hidden lg:flex lg:col-span-4 sticky top-20 flex-col gap-6"
        >
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-card">
            {/* Amount & Coverage */}
            <div className="flex flex-col gap-1 border-b border-border pb-5">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Total Grant Value
              </span>
              <div className="font-heading text-3xl xl:text-4xl font-bold tracking-tight text-foreground">
                {formatCurrency(scholarship.amount, scholarship.currency)}
              </div>
              <span className="text-xs font-semibold text-accent">
                {scholarship.coverage} &bull; {scholarship.type}
              </span>
            </div>

            {/* Next Deadline Countdown */}
            <div className="flex flex-col gap-1.5 border-b border-border pb-5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-4 text-accent" />
                <span className="font-medium">Application Deadline:</span>
              </div>
              <span className="font-heading text-lg font-bold text-foreground">
                {formatDate(scholarship.deadline)}
              </span>
              <DeadlineBadge deadline={scholarship.deadline} />
            </div>

            {/* Quick Specs */}
            <div className="flex flex-col gap-2 text-xs border-b border-border pb-5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target Degree:</span>
                <span className="font-semibold text-foreground">{scholarship.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Field of Study:</span>
                <span className="font-semibold text-foreground">{scholarship.field}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Effort to Apply:</span>
                <span className="font-semibold text-foreground">~{scholarship.estimatedMinutes} mins</span>
              </div>
            </div>

            {/* Desktop Actions */}
            <DetailActions scholarship={scholarship} />
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <DetailStickyBottom scholarship={scholarship} />

      {/* 6. Related Scholarships */}
      {related.length > 0 ? (
        <section className="flex flex-col gap-6 border-t border-border pt-12">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Related Scholarships
            </h2>
            <p className="text-sm text-muted-foreground">
              Other programs matching your criteria or with similar academic focus.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => (
              <ScholarshipCard key={rel.id} scholarship={rel} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
