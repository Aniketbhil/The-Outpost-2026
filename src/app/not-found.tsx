import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <Compass className="size-8" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
          404 &bull; Page Not Found
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Opportunity off the map<span className="text-accent">.</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
          The scholarship or page you are looking for does not exist or may have been relocated.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "min-h-[44px] gap-2 rounded-xl border-border text-foreground hover:bg-muted"
          )}
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/discover"
          className={cn(
            buttonVariants({ variant: "default" }),
            "min-h-[44px] gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Compass className="size-4 text-accent" />
          <span>Browse All Scholarships</span>
        </Link>
      </div>
    </div>
  );
}
