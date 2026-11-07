"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";
import { useIsMounted } from "@/hooks/use-is-mounted";

const ProfileWizardDialog = dynamic(
  () =>
    import("@/components/profile/ProfileWizardDialog").then(
      (mod) => mod.ProfileWizardDialog
    ),
  { ssr: false }
);

export function ProfileButton() {
  const [open, setOpen] = React.useState(false);
  const { profile } = useProfile();
  const mounted = useIsMounted();

  const hasProfile = mounted && Boolean(profile.fieldOfStudy);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="min-h-[44px] gap-2 rounded-lg border-border bg-background px-3 text-xs font-semibold text-foreground hover:bg-muted focus-visible:ring-ring"
        aria-label="Open profile match settings"
      >
        <Sparkles className="size-4 text-accent" />
        <span className="hidden sm:inline">
          {hasProfile ? "My Profile" : "Match Profile"}
        </span>
      </Button>

      <ProfileWizardDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
