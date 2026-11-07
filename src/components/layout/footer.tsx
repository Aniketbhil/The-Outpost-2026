import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 sm:py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              Grantly
            </span>
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">
              Frontend Scholarship Tracker
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built for Outpost &bull; Lightweight, local-first scholarship discovery
          </p>
        </div>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground" aria-label="Footer Navigation">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Discover
          </Link>
          <Link
            href="/tracker"
            className="inline-flex min-h-[44px] items-center transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            My Tracker
          </Link>
        </nav>
      </div>
    </footer>
  );
}
