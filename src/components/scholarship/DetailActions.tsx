"use client";

import * as React from "react";
import { useTracker } from "@/hooks/use-tracker";
import { useIsMounted } from "@/hooks/use-is-mounted";
import type { Scholarship, TrackingStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  BookmarkPlus,
  ExternalLink,
  CheckCircle2,
  Trash2,
} from "lucide-react";

interface DetailActionsProps {
  scholarship: Scholarship;
  compact?: boolean;
}

const STATUS_LABELS: Record<TrackingStatus, string> = {
  saved: "Saved",
  preparing: "Preparing",
  applied: "Applied",
  awarded: "Awarded",
  closed: "Closed",
};

export function DetailActions({
  scholarship,
  compact = false,
}: DetailActionsProps) {
  const mounted = useIsMounted();
  const { getItem, add, setStatus, remove } = useTracker();

  const trackedItem = mounted ? getItem(scholarship.id) : null;
  const isTracked = Boolean(trackedItem);

  const handleTrack = () => {
    add(scholarship.id, "saved");
    toast.success(`"${scholarship.name}" added to your saved tracker!`);
  };

  const handleStartApplication = () => {
    // Open application url
    window.open(scholarship.applyUrl, "_blank", "noopener,noreferrer");

    const previousStatus = trackedItem ? trackedItem.status : null;

    // Move to preparing
    if (!isTracked) {
      add(scholarship.id, "preparing");
    } else {
      setStatus(scholarship.id, "preparing");
    }

    toast.success("Application started! Marked as 'Preparing' in tracker.", {
      action: {
        label: "Undo",
        onClick: () => {
          if (!previousStatus) {
            remove(scholarship.id);
          } else {
            setStatus(scholarship.id, previousStatus);
          }
          toast.info("Status reverted.");
        },
      },
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === "remove") {
      remove(scholarship.id);
      toast.info(`Removed "${scholarship.name}" from tracker.`);
    } else {
      setStatus(scholarship.id, newStatus as TrackingStatus);
      toast.success(`Status updated to "${STATUS_LABELS[newStatus as TrackingStatus]}".`);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 w-full">
        {!isTracked ? (
          <Button
            onClick={handleTrack}
            variant="outline"
            className="min-h-[44px] flex-1 gap-1.5 border-border text-xs font-semibold text-foreground hover:bg-muted"
          >
            <BookmarkPlus className="size-4 text-accent" />
            <span>Track</span>
          </Button>
        ) : (
          <div className="flex-1 relative">
            <select
              value={trackedItem?.status || "saved"}
              onChange={handleStatusChange}
              className="w-full min-h-[44px] rounded-lg border border-accent/40 bg-accent/10 px-3 text-xs font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Application tracking status"
            >
              <option value="saved">Status: Saved</option>
              <option value="preparing">Status: Preparing</option>
              <option value="applied">Status: Applied</option>
              <option value="awarded">Status: Awarded</option>
              <option value="closed">Status: Closed</option>
              <option value="remove">Remove from tracker</option>
            </select>
          </div>
        )}

        <Button
          onClick={handleStartApplication}
          className="min-h-[44px] flex-1 gap-1.5 bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <span>Start Apply</span>
          <ExternalLink className="size-3.5 text-accent" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Primary Action Button */}
      <Button
        onClick={handleStartApplication}
        className="min-h-[48px] w-full gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <span>Start Application</span>
        <ExternalLink className="size-4 text-accent" />
      </Button>

      {/* Tracker Status Bar */}
      {!isTracked ? (
        <Button
          variant="outline"
          onClick={handleTrack}
          className="min-h-[44px] w-full gap-2 rounded-xl border-border bg-background text-sm font-semibold text-foreground hover:bg-muted"
        >
          <BookmarkPlus className="size-4 text-accent" />
          <span>Track this scholarship</span>
        </Button>
      ) : (
        <div className="flex flex-col gap-1.5 rounded-xl border border-accent/30 bg-accent/10 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-accent" />
              <span>Tracked Application</span>
            </span>
            <button
              type="button"
              onClick={() => {
                remove(scholarship.id);
                toast.info(`Removed "${scholarship.name}" from tracker.`);
              }}
              className="text-xs text-muted-foreground hover:text-accent hover:underline flex items-center gap-1"
              aria-label="Remove from tracker"
            >
              <Trash2 className="size-3" />
              <span>Remove</span>
            </button>
          </div>

          <label htmlFor="detail-status-select" className="sr-only">
            Change application status
          </label>
          <select
            id="detail-status-select"
            value={trackedItem?.status || "saved"}
            onChange={handleStatusChange}
            className="w-full min-h-[40px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="saved">Stage: Saved (Considering)</option>
            <option value="preparing">Stage: Preparing (Documents in progress)</option>
            <option value="applied">Stage: Applied (Submitted)</option>
            <option value="awarded">Stage: Awarded (Won)</option>
            <option value="closed">Stage: Closed / Rejected</option>
          </select>
        </div>
      )}
    </div>
  );
}
