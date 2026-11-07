import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAll, getBySlug, getRelated } from "@/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DeadlineBadge } from "@/components/scholarship/DeadlineBadge";
import { MatchBadge } from "@/components/scholarship/MatchBadge";
import { SaveButton } from "@/components/scholarship/SaveButton";
import { ScholarshipCard } from "@/components/scholarship/ScholarshipCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  CheckCircle2,
  FileText,
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
  if (!scholarship) return { title: "Scholarship Not Found - Grantly" };

  return {
    title: `${scholarship.name} - Grantly`,
    description: scholarship.summary,
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
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Back Link */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>Back to all scholarships</span>
        </Link>
      </nav>

      {/* Header section */}
      <header className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-muted-foreground">
              {scholarship.provider}
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {scholarship.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Globe className="size-4 text-accent" />
                <span>{scholarship.country}</span>
              </span>
              <span>&bull;</span>
              <span>{scholarship.level}</span>
              <span>&bull;</span>
              <span>{scholarship.field}</span>
              <span>&bull;</span>
              <span className="font-medium text-foreground">{scholarship.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <MatchBadge scholarship={scholarship} />
            <SaveButton
              scholarshipId={scholarship.id}
              scholarshipName={scholarship.name}
            />
          </div>
        </div>

        {/* Amount & Key Meta strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Award Funding
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              {formatCurrency(scholarship.amount, scholarship.currency)}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {scholarship.coverage} {scholarship.renewable ? "&bull; Renewable" : ""}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Application Deadline
            </span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {formatDate(scholarship.deadline)}
            </span>
            <DeadlineBadge deadline={scholarship.deadline} />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Effort &amp; GPA Cutoff
            </span>
            <span className="text-lg font-bold text-foreground">
              ~{scholarship.estimatedMinutes} mins to apply
            </span>
            <span className="text-xs text-muted-foreground">
              {scholarship.minGpa !== null
                ? `Minimum GPA requirement: ${scholarship.minGpa.toFixed(1)}`
                : "No minimum GPA cutoff required"}
            </span>
          </div>
        </div>

        {/* Primary CTA button */}
        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
          <a
            href={scholarship.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default" }),
              "min-h-[48px] gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            )}
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="size-4 text-accent" />
          </a>

          <Link
            href="/tracker"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-[48px] rounded-xl border-border px-6 text-sm font-semibold text-foreground hover:bg-muted"
            )}
          >
            <span>Open in Tracker</span>
          </Link>
        </div>
      </header>

      {/* Main Grid: Description & Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Description & Steps */}
        <div className="flex flex-col gap-8 lg:col-span-8">
          {/* Overview */}
          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Program Overview
            </h2>
            <div className="flex flex-col gap-4 text-base text-muted-foreground leading-relaxed">
              {scholarship.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>

          {/* Eligibility Criteria */}
          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-accent" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Eligibility Criteria
              </h2>
            </div>
            <ul className="flex flex-col gap-3 pt-2">
              {scholarship.eligibility.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-foreground">
                  <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Step-by-Step Application Guide */}
          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <ListOrdered className="size-5 text-accent" />
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Application Steps
              </h2>
            </div>
            <ol className="flex flex-col gap-4 pt-2">
              {scholarship.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-sm sm:text-base text-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-foreground">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Right Column: Required Documents Sidebar */}
        <aside className="flex flex-col gap-6 lg:col-span-4">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-accent" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Required Documents
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Ensure these documents are prepared in your Grantly checklist before applying.
            </p>
            <ul className="flex flex-col gap-2.5 pt-2">
              {scholarship.documents.map((doc, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-3 text-xs sm:text-sm font-medium text-foreground"
                >
                  <CheckCircle2 className="size-4 text-accent shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Related Scholarships */}
      {related.length > 0 ? (
        <section className="flex flex-col gap-6 border-t border-border pt-12">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Related Scholarships
            </h2>
            <p className="text-sm text-muted-foreground">
              Other programs with similar academic level, discipline, or regional focus.
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
