"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { useProfile } from "@/hooks/use-profile";
import { scoreMatch } from "@/lib/match";
import type { Scholarship } from "@/lib/types";
import { Sparkles } from "lucide-react";

export function MatchBadge({ scholarship }: { scholarship: Scholarship }) {
  const mounted = useIsMounted();
  const { profile } = useProfile();

  if (!mounted || !profile || !profile.fieldOfStudy) return null;

  const match = scoreMatch(scholarship, profile);
  if (match.score <= 0) return null;

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-foreground"
      title={match.reasons.map((r) => `${r.met ? "✓" : "✗"} ${r.label}`).join("\n")}
    >
      <Sparkles className="size-3 text-accent" />
      <span>{match.score}% fit</span>
    </div>
  );
}
