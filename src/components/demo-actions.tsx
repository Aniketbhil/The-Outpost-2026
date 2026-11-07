"use client";

import { toast } from "sonner";
import { Sparkles, RefreshCw, BookmarkPlus } from "lucide-react";
import { useTracker } from "@/hooks/use-tracker";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function DemoActions() {
  const { count, loadDemo, reset, isSaved, add } = useTracker();
  const mounted = useIsMounted();

  const handleLoadDemo = () => {
    loadDemo();
    toast.success("Loaded demo scholarship tracker entries!");
  };

  const handleReset = () => {
    reset();
    toast.info("Tracker reset to empty state.");
  };

  const handleSampleAdd = () => {
    if (isSaved("sch-sample")) {
      toast.info("Sample scholarship already in tracker!");
    } else {
      add("sch-sample", "saved");
      toast.success("Added sample scholarship to your tracker!");
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Interactive Token &amp; Store Verifier
        </h3>
        <p className="text-sm text-muted-foreground">
          Test localStorage persistence, live badge synchronization, and theme-token states.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleLoadDemo}
          className="min-h-[44px] gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Sparkles className="size-4 text-accent" />
          <span>Load Demo Data (4 items)</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleSampleAdd}
          className="min-h-[44px] gap-2 border-border bg-background text-foreground hover:bg-muted"
        >
          <BookmarkPlus className="size-4 text-accent" />
          <span>Add Sample Item</span>
        </Button>

        <Button
          variant="ghost"
          onClick={handleReset}
          className="min-h-[44px] gap-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <RefreshCw className="size-4" />
          <span>Reset Tracker</span>
        </Button>
      </div>

      {/* Live State Info */}
      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground">Store Sync:</span>
          <Badge variant="outline" className="border-accent/40 bg-accent/10 text-foreground">
            {mounted ? `${count} tracked scholarships` : "Hydrating..."}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground">Sample Currencies:</span>
          <span className="font-medium text-foreground">
            {formatCurrency(15000, "USD")} &bull; {formatCurrency(12500, "EUR")} &bull;{" "}
            {formatCurrency(8500, "GBP")} &bull; {formatCurrency(500000, "INR")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground">Sample Date:</span>
          <span className="font-medium text-foreground">
            {formatDate("2026-12-15T00:00:00.000Z")}
          </span>
        </div>
      </div>
    </div>
  );
}
