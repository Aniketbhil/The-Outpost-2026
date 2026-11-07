"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { daysUntil, formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

export function DeadlineBadge({ deadline }: { deadline: string }) {
  const mounted = useIsMounted();
  const days = mounted ? daysUntil(deadline) : null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock className="size-3.5 text-accent shrink-0" aria-hidden="true" />
      <span>{formatDate(deadline, { month: "short", day: "numeric" })}</span>
      {days !== null ? (
        days <= 14 && days >= 0 ? (
          <span className="inline-flex items-center rounded bg-accent px-1.5 py-0.5 text-xs font-bold text-accent-foreground">
            {days === 0 ? "Due today" : `${days}d left`}
          </span>
        ) : (
          <span className="font-semibold text-foreground">
            &bull; {days < 0 ? "Closed" : `${days}d left`}
          </span>
        )
      ) : null}
    </div>
  );
}
