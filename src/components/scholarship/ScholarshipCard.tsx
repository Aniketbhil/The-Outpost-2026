import Link from "next/link";
import type { Scholarship } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DeadlineBadge } from "./DeadlineBadge";
import { MatchBadge } from "./MatchBadge";
import { SaveButton } from "./SaveButton";
import { Globe, ArrowRight } from "lucide-react";

export function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  return (
    <Card className="group flex h-full flex-col justify-between border-border bg-card transition-all duration-200 hover:border-accent/40 hover:shadow-card">
      <CardHeader className="flex flex-col gap-3 p-5 sm:p-6">
        {/* Top bar: Provider, country, and Save button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              {scholarship.provider}
            </span>
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="size-3 text-accent" />
                <span>{scholarship.country}</span>
              </span>
              <span className="text-xs text-muted-foreground">&bull;</span>
              <span className="text-xs font-medium text-foreground">
                {scholarship.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MatchBadge scholarship={scholarship} />
            <SaveButton
              scholarshipId={scholarship.id}
              scholarshipName={scholarship.name}
            />
          </div>
        </div>

        {/* Scholarship Name */}
        <Link
          href={`/scholarships/${scholarship.slug}`}
          className="group-hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <h3 className="font-heading text-lg sm:text-xl font-bold leading-snug text-foreground">
            {scholarship.name}
          </h3>
        </Link>

        {/* 1-sentence summary */}
        <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {scholarship.summary}
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-4 sm:px-6">
        {/* Amount & Coverage */}
        <div className="flex items-baseline justify-between rounded-lg border border-border bg-background/50 p-3">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Funding Amount
            </span>
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(scholarship.amount, scholarship.currency)}
            </span>
          </div>

          <Badge
            variant="outline"
            className="border-accent/40 bg-accent/10 text-xs font-semibold text-foreground"
          >
            {scholarship.coverage}
          </Badge>
        </div>

        {/* Filter tags / badges */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
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
          {scholarship.renewable ? (
            <Badge
              variant="outline"
              className="rounded-md border-border text-xs text-muted-foreground"
            >
              Renewable
            </Badge>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border px-5 py-3.5 sm:px-6">
        <DeadlineBadge deadline={scholarship.deadline} />

        <Link
          href={`/scholarships/${scholarship.slug}`}
          className="inline-flex min-h-[44px] items-center gap-1 text-xs font-semibold text-foreground transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-ring rounded-md px-2"
        >
          <span>View Details</span>
          <ArrowRight className="size-3.5 text-accent transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
