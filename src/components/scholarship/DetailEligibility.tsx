"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useProfile } from "@/hooks/use-profile";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { scoreMatch } from "@/lib/match";
import type { Scholarship } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const ProfileWizardDialog = dynamic(
  () =>
    import("@/components/profile/ProfileWizardDialog").then(
      (mod) => mod.ProfileWizardDialog
    ),
  { ssr: false }
);

interface DetailEligibilityProps {
  scholarship: Scholarship;
}

export function DetailEligibility({ scholarship }: DetailEligibilityProps) {
  const mounted = useIsMounted();
  const { profile } = useProfile();
  const [wizardOpen, setWizardOpen] = React.useState(false);

  const hasProfile = mounted && Boolean(profile.fieldOfStudy);
  const match = hasProfile ? scoreMatch(scholarship, profile) : null;
  const metCount = match ? match.reasons.filter((r) => r.met).length : 0;
  const totalReasons = match ? match.reasons.length : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Match Status Box */}
      {hasProfile && match ? (
        <div className="flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent/10 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent shrink-0" />
              <span className="font-heading text-base font-bold text-foreground">
                You meet {metCount} of {totalReasons} evaluated criteria
              </span>
            </div>
            <Badge
              variant="outline"
              className="border-accent/40 bg-card text-xs font-bold text-foreground self-start sm:self-auto"
            >
              {match.score}% Fit Score
            </Badge>
          </div>

          {/* Granular Profile Evaluation Breakdown */}
          <div className="grid grid-cols-1 gap-2 pt-1 border-t border-accent/20">
            {match.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 text-xs text-foreground"
              >
                {reason.met ? (
                  <CheckCircle2 className="size-4 text-accent shrink-0" />
                ) : (
                  <AlertCircle className="size-4 text-accent shrink-0 opacity-75" />
                )}
                <span className={reason.met ? "font-medium" : "text-muted-foreground"}>
                  {reason.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-accent/20">
            <span className="text-[11px] text-muted-foreground">
              Evaluated against your local profile ({profile.educationLevel}, {profile.fieldOfStudy}, {profile.country})
            </span>
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="text-xs font-semibold text-accent hover:underline"
            >
              Update Profile
            </button>
          </div>
        </div>
      ) : (
        /* No Profile Prompt */
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent shrink-0 mt-0.5">
              <Sparkles className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-sm font-bold text-foreground">
                Check eligibility against your profile
              </span>
              <span className="text-xs text-muted-foreground">
                Set your degree level, GPA, and country to see whether you qualify.
              </span>
            </div>
          </div>

          <Button
            onClick={() => setWizardOpen(true)}
            size="sm"
            className="min-h-[40px] gap-1.5 self-start sm:self-auto bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="size-3.5 text-accent" />
            <span>Match Profile</span>
          </Button>
        </div>
      )}

      {/* Official Criteria List */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Official Provider Criteria
        </h3>
        <ul className="flex flex-col gap-2.5">
          {scholarship.eligibility.map((crit, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-sm text-foreground"
            >
              <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
              <span className="leading-relaxed">{crit}</span>
            </li>
          ))}
        </ul>
      </div>

      <ProfileWizardDialog open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}
