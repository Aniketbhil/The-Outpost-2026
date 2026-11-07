import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, FileText, Send, Award } from "lucide-react";

const COLUMNS = [
  {
    id: "saved",
    label: "Saved",
    description: "Evaluating fit & initial requirements",
    icon: Bookmark,
  },
  {
    id: "preparing",
    label: "Preparing",
    description: "Drafting essays & collecting documents",
    icon: FileText,
  },
  {
    id: "applied",
    label: "Applied",
    description: "Submitted dossiers awaiting decision",
    icon: Send,
  },
  {
    id: "done",
    label: "Awarded & Closed",
    description: "Final award outcomes & past cycles",
    icon: Award,
  },
];

export function TrackerSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* 4-Column Board Sized Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4 min-h-[460px]"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-accent" />
                  <span className="font-heading text-sm font-bold text-foreground">
                    {col.label}
                  </span>
                </div>
                <Skeleton className="h-5 w-8 rounded-full bg-muted" />
              </div>

              <p className="text-xs text-muted-foreground pb-1">
                {col.description}
              </p>

              {/* Sample Card Placeholder */}
              <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1 w-full">
                    <Skeleton className="h-3 w-20 bg-muted" />
                    <Skeleton className="h-5 w-4/5 bg-muted" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <Skeleton className="h-4 w-16 bg-muted" />
                  <Skeleton className="h-4 w-20 bg-muted" />
                </div>
                <Skeleton className="h-2 w-full rounded bg-muted" />
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm opacity-70">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-3 w-24 bg-muted" />
                  <Skeleton className="h-5 w-3/4 bg-muted" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <Skeleton className="h-4 w-14 bg-muted" />
                  <Skeleton className="h-4 w-16 bg-muted" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
