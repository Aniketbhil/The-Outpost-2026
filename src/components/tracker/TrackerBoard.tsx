"use client";

import * as React from "react";
import Link from "next/link";
import { useTracker } from "@/hooks/use-tracker";
import { useIsMounted } from "@/hooks/use-is-mounted";
import type { Scholarship, TrackedItem, TrackingStatus } from "@/lib/types";
import { formatCurrency, daysUntil, formatDate } from "@/lib/utils";
import { getAmountInUSD } from "@/lib/filter";
import { TrackerCard } from "./TrackerCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookmarkCheck,
  DollarSign,
  Send,
  CalendarClock,
  Sparkles,
  MoreVertical,
  RotateCcw,
  FolderOpen,
  Compass,
} from "lucide-react";
import { m, LazyMotion, domAnimation } from "motion/react";
import { toast } from "sonner";

interface TrackerBoardProps {
  scholarships: Scholarship[];
}

const COLUMNS: {
  id: "saved" | "preparing" | "applied" | "done";
  label: string;
  statuses: TrackingStatus[];
  description: string;
}[] = [
  {
    id: "saved",
    label: "Saved",
    statuses: ["saved"],
    description: "Evaluating fit & initial requirements",
  },
  {
    id: "preparing",
    label: "Preparing",
    statuses: ["preparing"],
    description: "Drafting essays & collecting documents",
  },
  {
    id: "applied",
    label: "Applied",
    statuses: ["applied"],
    description: "Submitted dossiers awaiting decision",
  },
  {
    id: "done",
    label: "Awarded & Closed",
    statuses: ["awarded", "closed"],
    description: "Final award outcomes & past cycles",
  },
];

export function TrackerBoard({ scholarships }: TrackerBoardProps) {
  const mounted = useIsMounted();
  const { tracked, count, loadDemo, reset } = useTracker();
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);

  // Map scholarship lookup for O(1) retrieval
  const scholarshipMap = React.useMemo(() => {
    const map = new Map<string, Scholarship>();
    for (const s of scholarships) {
      map.set(s.id, s);
    }
    return map;
  }, [scholarships]);

  const trackedList: TrackedItem[] = React.useMemo(() => {
    return Object.values(tracked);
  }, [tracked]);

  // Aggregate metrics
  const { totalFundingUSD, submittedCount, nextUpcomingItem, upcomingAgenda } =
    React.useMemo(() => {
      let funding = 0;
      let submitted = 0;
      let nextDeadlineDays: number | null = null;
      let nextItem: { item: TrackedItem; scholarship: Scholarship; days: number } | null = null;
      const agenda: { item: TrackedItem; scholarship: Scholarship; days: number }[] = [];

      for (const item of trackedList) {
        const sch = scholarshipMap.get(item.scholarshipId);
        if (!sch) continue;

        funding += getAmountInUSD(sch);

        if (item.status === "applied" || item.status === "awarded") {
          submitted += 1;
        }

        // Active upcoming deadlines
        if (item.status === "saved" || item.status === "preparing") {
          const days = daysUntil(sch.deadline);
          agenda.push({ item, scholarship: sch, days });

          if (days >= 0) {
            if (nextDeadlineDays === null || days < nextDeadlineDays) {
              nextDeadlineDays = days;
              nextItem = { item, scholarship: sch, days };
            }
          }
        }
      }

      agenda.sort((a, b) => a.days - b.days);

      return {
        totalFundingUSD: funding,
        submittedCount: submitted,
        nextUpcomingItem: nextItem,
        upcomingAgenda: agenda,
      };
    }, [trackedList, scholarshipMap]);

  const handleLoadDemo = () => {
    loadDemo();
    toast.success("Loaded 5 realistic demo scholarship applications into your tracker!");
  };

  const handleResetConfirm = () => {
    reset();
    setResetDialogOpen(false);
    toast.info("Application tracker has been reset to empty.");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Top Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              My Application Tracker
            </h1>
            <Badge
              variant="outline"
              className="border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-foreground"
            >
              {mounted ? `${count} tracked` : "Loading..."}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your saved programs, document preparation checklists, notes, and deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/discover"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-h-[40px] gap-1.5 border-border text-xs font-semibold text-foreground hover:bg-muted"
            )}
          >
            <Compass className="size-3.5 text-accent" />
            <span>Browse Directory</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Tracker options"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-border bg-card">
              <DropdownMenuItem
                onClick={handleLoadDemo}
                className="gap-2 text-xs font-medium cursor-pointer"
              >
                <Sparkles className="size-3.5 text-accent" />
                <span>Load Demo Dataset (5)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setResetDialogOpen(true)}
                className="gap-2 text-xs font-medium text-accent cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-accent" />
                <span>Reset All Tracked</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 1. Summary Metrics Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Metric 1: Total Tracked */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookmarkCheck className="size-4 text-accent" />
            <span className="font-medium">Total Tracked</span>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            {mounted ? count : "--"}
          </div>
          <span className="text-xs text-muted-foreground">
            Programs in workspace
          </span>
        </div>

        {/* Metric 2: Funding in Play */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <DollarSign className="size-4 text-accent" />
            <span className="font-medium">Funding in Play</span>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            {mounted ? formatCurrency(Math.round(totalFundingUSD), "USD") : "--"}
          </div>
          <span className="text-xs text-muted-foreground">
            Approx. USD equivalent
          </span>
        </div>

        {/* Metric 3: Applications Submitted */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Send className="size-4 text-accent" />
            <span className="font-medium">Submitted</span>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            {mounted ? submittedCount : "--"}
          </div>
          <span className="text-xs text-muted-foreground">
            Applied or awarded
          </span>
        </div>

        {/* Metric 4: Next Deadline */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="size-4 text-accent" />
            <span className="font-medium">Next Cutoff</span>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            {mounted && nextUpcomingItem
              ? nextUpcomingItem.days === 0
                ? "Today!"
                : `${nextUpcomingItem.days}d left`
              : "No deadline"}
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {mounted && nextUpcomingItem
              ? nextUpcomingItem.scholarship.name
              : "All caught up"}
          </span>
        </div>
      </div>

      {/* 2. Upcoming Deadlines Agenda Strip (if active deadlines exist) */}
      {mounted && upcomingAgenda.length > 0 ? (
        <section
          aria-labelledby="agenda-heading"
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="size-4 text-accent" />
              <h2 id="agenda-heading" className="font-heading text-sm font-bold text-foreground">
                Upcoming Application Deadlines (Active)
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {upcomingAgenda.length} active countdown{upcomingAgenda.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 pt-1 -mx-2 px-2">
            {upcomingAgenda.map(({ item, scholarship, days }) => (
              <Link
                key={item.scholarshipId}
                href={`/scholarships/${scholarship.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-background p-3 text-xs shrink-0 w-64 hover:border-accent/40 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    {days <= 14 && days >= 0 ? (
                      <span className="inline-flex items-center rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-accent-foreground">
                        {days === 0 ? "Due Today" : `Due in ${days}d`}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-foreground tracking-wide">
                        {days < 0 ? "Closed" : `Due in ${days} days`}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatDate(scholarship.deadline, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                    {scholarship.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-2 mt-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {formatCurrency(scholarship.amount, scholarship.currency)}
                  </span>
                  <span className="capitalize text-foreground font-semibold">
                    {item.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* 3. Main Workspace Board: Desktop 4-Columns / Mobile Tabs */}
      {mounted && count > 0 ? (
        <LazyMotion features={domAnimation}>
          {/* Desktop 4-Column Board */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6 items-start">
            {COLUMNS.map((col) => {
              const colItems = trackedList.filter((item) =>
                col.statuses.includes(item.status)
              );

              return (
                <div
                  key={col.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-4 min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex flex-col">
                      <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-1.5">
                        <span>{col.label}</span>
                        <Badge
                          variant="secondary"
                          className="rounded-full px-2 py-0.5 text-xs font-bold"
                        >
                          {colItems.length}
                        </Badge>
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {col.description}
                      </span>
                    </div>
                  </div>

                  {/* Card List with Layout Animation */}
                  <div className="flex flex-col gap-4">
                    {colItems.map((item) => {
                      const scholarship = scholarshipMap.get(item.scholarshipId);
                      if (!scholarship) return null;

                      return (
                        <m.div
                          key={item.scholarshipId}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TrackerCard
                            item={item}
                            scholarship={scholarship}
                          />
                        </m.div>
                      );
                    })}

                    {colItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground min-h-[120px]">
                        <span>No scholarships in {col.label} stage</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Tabs View */}
          <div className="lg:hidden flex flex-col gap-4">
            <Tabs defaultValue="saved" className="w-full">
              <TabsList className="flex sm:grid sm:grid-cols-4 w-full overflow-x-auto h-auto p-1 bg-muted/60 border border-border">
                {COLUMNS.map((col) => {
                  const colCount = trackedList.filter((item) =>
                    col.statuses.includes(item.status)
                  ).length;

                  return (
                    <TabsTrigger
                      key={col.id}
                      value={col.id}
                      className="flex-1 min-w-[68px] py-2 sm:py-2.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{col.label}</span>
                        <span className="text-xs font-bold text-foreground opacity-80">
                          ({colCount})
                        </span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {COLUMNS.map((col) => {
                const colItems = trackedList.filter((item) =>
                  col.statuses.includes(item.status)
                );

                return (
                  <TabsContent key={col.id} value={col.id} className="pt-4">
                    <div className="flex flex-col gap-4">
                      {colItems.map((item) => {
                        const scholarship = scholarshipMap.get(item.scholarshipId);
                        if (!scholarship) return null;

                        return (
                          <TrackerCard
                            key={item.scholarshipId}
                            item={item}
                            scholarship={scholarship}
                          />
                        );
                      })}

                      {colItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                          <FolderOpen className="size-8 text-muted-foreground/60 mb-2" />
                          <span>No scholarships currently in {col.label}</span>
                        </div>
                      ) : null}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </LazyMotion>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-10 sm:p-16 text-center shadow-sm">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/15 text-accent mb-4">
            <BookmarkCheck className="size-8" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Your application tracker is empty
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
            Save opportunities from our verified directory, assemble your checklists, and manage deadline timelines directly in your browser.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/discover"
              className={cn(
                buttonVariants({ variant: "default" }),
                "min-h-[44px] gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Compass className="size-4 text-accent" />
              <span>Browse Scholarships</span>
            </Link>

            <Button
              variant="outline"
              onClick={handleLoadDemo}
              className="min-h-[44px] gap-2 rounded-xl border-border bg-background px-6 font-semibold text-foreground hover:bg-muted"
            >
              <Sparkles className="size-4 text-accent" />
              <span>Load Demo Data (5 items)</span>
            </Button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md border-border bg-card p-6">
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="font-heading text-lg font-bold text-foreground">
              Reset Application Tracker?
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              This action will delete all tracked scholarships, document checklists, and personal notes stored in your browser. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setResetDialogOpen(false)}
              className="min-h-[44px] border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetConfirm}
              className="min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Yes, Reset Tracker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
