"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { daysUntil, formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

export function DeadlineBadge({ deadline }: { deadline: string }) {
  const mounted = useIsMounted();
  const days = mounted ? daysUntil(deadline) : null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Clock className="size-3.5 text-accent shrink-0" />
      <span>{formatDate(deadline, { month: "short", day: "numeric" })}</span>
      {days !== null ? (
        <span
          className={`font-semibold ${
            days <= 30 ? "text-accent" : "text-muted-foreground"
          }`}
        >
          &bull; {days < 0 ? "Expired" : days === 0 ? "Today" : `${days}d left`}
        </span>
      ) : null}
    </div>
  );
}
