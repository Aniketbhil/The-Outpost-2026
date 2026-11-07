"use client";

import * as React from "react";
import Link from "next/link";
import { useTracker } from "@/hooks/use-tracker";
import { useIsMounted } from "@/hooks/use-is-mounted";
import type { Scholarship, TrackedItem, TrackingStatus } from "@/lib/types";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  AlertCircle,
  FileCheck2,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface TrackerCardProps {
  item: TrackedItem;
  scholarship: Scholarship;
}

const STATUS_OPTIONS: { value: TrackingStatus; label: string }[] = [
  { value: "saved", label: "Saved (Considering)" },
  { value: "preparing", label: "Preparing (Assembling)" },
  { value: "applied", label: "Applied (Submitted)" },
  { value: "awarded", label: "Awarded (Won)" },
  { value: "closed", label: "Closed / Inactive" },
];

export function TrackerCard({ item, scholarship }: TrackerCardProps) {
  const mounted = useIsMounted();
  const { setStatus, toggleDoc, setNotes, remove } = useTracker();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [checklistExpanded, setChecklistExpanded] = React.useState(false);
  const [prevNotes, setPrevNotes] = React.useState(item.notes || "");
  const [localNotes, setLocalNotes] = React.useState(item.notes || "");

  if (prevNotes !== (item.notes || "")) {
    setPrevNotes(item.notes || "");
    setLocalNotes(item.notes || "");
  }

  // Debounced notes autosave
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localNotes !== item.notes) {
        setNotes(scholarship.id, localNotes);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localNotes, item.notes, scholarship.id, setNotes]);

  // Document checklist calculation
  const checklist = item.checklist || {};
  const completedDocsCount = scholarship.documents.filter(
    (doc) => Boolean(checklist[doc])
  ).length;
  const totalDocsCount = scholarship.documents.length;
  const docsProgress =
    totalDocsCount > 0
      ? Math.round((completedDocsCount / totalDocsCount) * 100)
      : 0;

  // Deadline calculation
  const daysLeft = mounted ? daysUntil(scholarship.deadline) : null;
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14;
  const isPast = daysLeft !== null && daysLeft < 0;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as TrackingStatus;
    setStatus(scholarship.id, nextStatus);
    toast.success(`Moved "${scholarship.name}" to ${nextStatus}.`);
  };

  const handleRemove = () => {
    remove(scholarship.id);
    toast.info(`Removed "${scholarship.name}" from tracker.`);
    setConfirmOpen(false);
  };

  return (
    <>
      <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all hover:border-accent/40 hover:shadow-card">
        {/* Top Header: Provider, Status Select, Delete */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-muted-foreground truncate">
              {scholarship.provider}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <label htmlFor={`status-${scholarship.id}`} className="sr-only">
                Change status for {scholarship.name}
              </label>
              <select
                id={`status-${scholarship.id}`}
                value={item.status}
                onChange={handleStatusChange}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="size-8 rounded-md border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Remove ${scholarship.name} from tracker`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Name & Amount */}
          <div className="flex flex-col gap-1">
            <Link
              href={`/scholarships/${scholarship.slug}`}
              className="font-heading text-base font-bold text-foreground hover:text-accent transition-colors line-clamp-2"
            >
              {scholarship.name}
            </Link>
            <div className="flex items-center justify-between pt-0.5">
              <span className="font-heading text-lg font-bold text-foreground">
                {formatCurrency(scholarship.amount, scholarship.currency)}
              </span>
              <Badge
                variant="outline"
                className="border-accent/30 bg-accent/10 text-xs font-semibold text-foreground"
              >
                {scholarship.coverage}
              </Badge>
            </div>
          </div>

          {/* Urgency & Deadline Banner */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-accent shrink-0" />
              <span className="text-muted-foreground">
                {formatDate(scholarship.deadline, { month: "short", day: "numeric" })}
              </span>
            </div>

            {/* Urgency label derived strictly via accent + icon + text */}
            {isPast ? (
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <span>Closed</span>
              </span>
            ) : isUrgent ? (
              <span className="inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                <AlertCircle className="size-3 text-accent-foreground" aria-hidden="true" />
                <span>
                  {daysLeft === 0 ? "Due today!" : `Due in ${daysLeft} days`}
                </span>
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                {daysLeft !== null ? `${daysLeft} days left` : ""}
              </span>
            )}
          </div>

          {/* Document Checklist Summary & Accordion */}
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground flex items-center gap-1.5 text-xs">
                <FileCheck2 className="size-3.5 text-accent" />
                <span>Documents</span>
              </span>
              <button
                type="button"
                onClick={() => setChecklistExpanded((prev) => !prev)}
                className="flex items-center gap-1 text-xs font-semibold text-foreground hover:text-accent hover:underline"
              >
                <span>
                  {completedDocsCount}/{totalDocsCount} ({docsProgress}%)
                </span>
                {checklistExpanded ? (
                  <ChevronUp className="size-3 text-accent" />
                ) : (
                  <ChevronDown className="size-3 text-accent" />
                )}
              </button>
            </div>

            <Progress
              value={docsProgress}
              className="h-1.5 bg-muted"
              aria-label="Document completion progress"
            />

            {checklistExpanded ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-border mt-1">
                {scholarship.documents.map((doc, idx) => {
                  const isChecked = Boolean(checklist[doc]);
                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-2 text-xs text-foreground cursor-pointer"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleDoc(scholarship.id, doc)}
                        className="data-[state=checked]:bg-accent data-[state=checked]:border-accent text-accent-foreground size-3.5"
                        aria-label={`Toggle ${doc}`}
                      />
                      <span className={isChecked ? "line-through opacity-70" : "font-medium"}>
                        {doc}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Notes Textarea (Debounced Autosave) */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`notes-${scholarship.id}`}
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Application Notes (Autosaved)
            </label>
            <Textarea
              id={`notes-${scholarship.id}`}
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              placeholder="Record deadlines, reference contacts, portal passwords, draft essay links..."
              className="h-16 min-h-[56px] resize-none border-border bg-background text-xs leading-relaxed placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Card Footer: Portal Link */}
        <div className="flex items-center justify-between border-t border-border pt-3 mt-4 text-xs">
          <Link
            href={`/scholarships/${scholarship.slug}`}
            className="font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Full Details
          </Link>
          <a
            href={scholarship.applyUrl.startsWith("http") ? scholarship.applyUrl : "#"}
            target={scholarship.applyUrl.startsWith("http") ? "_blank" : undefined}
            rel={scholarship.applyUrl.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-accent hover:underline"
          >
            <span>Official Portal</span>
            <ExternalLink className="size-3 text-accent" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card p-6">
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              Remove from tracker?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to remove &ldquo;{scholarship.name}&rdquo;? Your document checklist and personal notes for this program will be deleted from local storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              className="min-h-[44px] border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRemove}
              className="min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Yes, Remove Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
