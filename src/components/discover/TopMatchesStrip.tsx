"use client";

import * as React from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/use-profile";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { scoreMatch } from "@/lib/match";
import { formatCurrency } from "@/lib/utils";
import type { Scholarship } from "@/lib/types";
import { Sparkles, Edit3, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopMatchesStripProps {
  scholarships: Scholarship[];
  onEditProfile: () => void;
}

export function TopMatchesStrip({
  scholarships,
  onEditProfile,
}: TopMatchesStripProps) {
  const mounted = useIsMounted();
  const { profile } = useProfile();

  if (!mounted || !profile || !profile.fieldOfStudy) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-accent/40 bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">
                Get your personalized match score
              </h2>
              <Badge variant="outline" className="border-accent/40 bg-accent/10 text-xs font-semibold text-foreground">
                0–100% Fit
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Answer 4 quick questions (education level, study field, nationality, GPA) to calculate instant eligibility ratings across all 30 scholarships.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEditProfile}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-xs font-bold text-accent-foreground hover:bg-accent/90 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="size-4" />
          <span>Get Your Match Score</span>
        </button>
      </div>
    );
  }

  // Calculate top 3 matching scholarships
  const topMatches = [...scholarships]
    .map((s) => ({
      scholarship: s,
      match: scoreMatch(s, profile),
    }))
    .filter((item) => item.match.score >= 50)
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  if (topMatches.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-accent/40 bg-card p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-foreground">
                Top 3 tailored for you
              </h2>
              <Badge variant="outline" className="border-accent/40 bg-accent/10 text-xs font-semibold text-foreground">
                Active Match
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {profile.educationLevel} &bull; {profile.fieldOfStudy} &bull; {profile.country}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onEditProfile}
          className="min-h-[36px] self-start sm:self-auto gap-1.5 border-border bg-background text-xs font-semibold text-foreground hover:bg-muted"
        >
          <Edit3 className="size-3.5 text-accent" />
          <span>Edit Profile</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {topMatches.map(({ scholarship, match }) => (
          <Link
            key={scholarship.id}
            href={`/scholarships/${scholarship.slug}`}
            className="group flex flex-col justify-between rounded-xl border border-border bg-background p-3.5 transition-all hover:border-accent/50 hover:bg-muted/40"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground truncate">
                  {scholarship.provider}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-foreground">
                  <Award className="size-2.5 text-accent" />
                  {match.score}% fit
                </span>
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                {scholarship.name}
              </h3>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-2.5 mt-2">
              <span className="text-xs font-bold text-foreground">
                {formatCurrency(scholarship.amount, scholarship.currency)}
              </span>
              <span className="inline-flex items-center text-xs font-bold text-foreground group-hover:text-accent gap-0.5 transition-colors">
                View <ArrowRight className="size-3 text-accent group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
