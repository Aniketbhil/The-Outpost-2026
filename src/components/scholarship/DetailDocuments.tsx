"use client";

import * as React from "react";
import { useTracker } from "@/hooks/use-tracker";
import { useIsMounted } from "@/hooks/use-is-mounted";
import type { Scholarship } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FileCheck, BookmarkPlus, CheckCircle2 } from "lucide-react";

interface DetailDocumentsProps {
  scholarship: Scholarship;
}

export function DetailDocuments({ scholarship }: DetailDocumentsProps) {
  const mounted = useIsMounted();
  const { getItem, toggleDoc, add } = useTracker();

  const trackedItem = mounted ? getItem(scholarship.id) : null;
  const isTracked = Boolean(trackedItem);

  const checklist = trackedItem?.checklist || {};
  const completedCount = scholarship.documents.filter(
    (doc) => Boolean(checklist[doc])
  ).length;
  const totalCount = scholarship.documents.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (docName: string) => {
    if (!isTracked) {
      add(scholarship.id, "preparing");
      toggleDoc(scholarship.id, docName);
      toast.success(`Tracked "${scholarship.name}" and marked "${docName}" ready!`);
    } else {
      toggleDoc(scholarship.id, docName);
      const isNowChecked = !checklist[docName];
      if (isNowChecked) {
        toast.success(`Marked "${docName}" as ready!`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Tracker Status & Progress Header */}
      {isTracked ? (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground flex items-center gap-1.5">
              <FileCheck className="size-4 text-accent" />
              <span>Application Document Readiness</span>
            </span>
            <span className="text-accent font-bold">
              {completedCount} of {totalCount} ready ({progressPercent}%)
            </span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-muted" />
          {progressPercent === 100 ? (
            <span className="text-xs font-medium text-foreground flex items-center gap-1 pt-0.5">
              <CheckCircle2 className="size-3.5 text-accent" />
              <span>All documents ready for submission!</span>
            </span>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-dashed border-border bg-card p-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-foreground">
              Document Checklist Tracker
            </span>
            <span className="text-xs text-muted-foreground">
              Track this program to check off files as you assemble them.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => {
              add(scholarship.id, "preparing");
              toast.success(`Tracked "${scholarship.name}"! You can now check off documents.`);
            }}
            className="min-h-[38px] gap-1.5 self-start sm:self-auto bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <BookmarkPlus className="size-3.5 text-accent" />
            <span>Enable Checklist</span>
          </Button>
        </div>
      )}

      {/* Checkbox Document List */}
      <div className="flex flex-col gap-2.5">
        {scholarship.documents.map((doc, idx) => {
          const isChecked = Boolean(checklist[doc]);
          return (
            <label
              key={idx}
              className={`flex items-center justify-between rounded-xl border p-3.5 text-sm transition-all cursor-pointer ${
                isChecked
                  ? "border-accent/40 bg-accent/10 text-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(doc)}
                  className="data-[state=checked]:bg-accent data-[state=checked]:border-accent text-accent-foreground"
                  aria-label={`Mark ${doc} as prepared`}
                />
                <span className={isChecked ? "font-semibold" : "font-medium"}>
                  {doc}
                </span>
              </div>

              <span className="text-[11px] text-muted-foreground">
                {isChecked ? "Prepared" : "Pending"}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
