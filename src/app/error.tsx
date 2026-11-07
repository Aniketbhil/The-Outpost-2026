"use client";

import * as React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Grantly runtime caught error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <AlertCircle className="size-8" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Application Notice
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Something went off course<span className="text-accent">.</span>
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          An unexpected interface error occurred. Your saved tracker data in localStorage remains safe and intact.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          onClick={() => reset()}
          className="min-h-[44px] gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <RotateCcw className="size-4 text-accent" />
          <span>Try Again</span>
        </Button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "min-h-[44px] gap-2 rounded-xl border-border text-foreground hover:bg-muted"
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
