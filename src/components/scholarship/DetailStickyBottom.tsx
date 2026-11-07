"use client";

import type { Scholarship } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { DetailActions } from "./DetailActions";

interface DetailStickyBottomProps {
  scholarship: Scholarship;
}

export function DetailStickyBottom({ scholarship }: DetailStickyBottomProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-border bg-background/95 backdrop-blur-md p-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-card"
      aria-label="Mobile quick actions"
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-heading text-base font-bold text-foreground leading-tight">
            {formatCurrency(scholarship.amount, scholarship.currency)}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {scholarship.coverage}
          </span>
        </div>

        <div className="flex-1 max-w-[260px]">
          <DetailActions scholarship={scholarship} compact={true} />
        </div>
      </div>
    </div>
  );
}
