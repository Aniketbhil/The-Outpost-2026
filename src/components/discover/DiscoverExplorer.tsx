"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfile } from "@/hooks/use-profile";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { filterAndSortScholarships } from "@/lib/filter";
import type { Scholarship } from "@/lib/types";
import { ScholarshipCard } from "@/components/scholarship/ScholarshipCard";
import { TopMatchesStrip } from "./TopMatchesStrip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  X,
  Sparkles,
  SearchX,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { m, LazyMotion, domAnimation } from "motion/react";

// Lazy-load the profile wizard dialog
const ProfileWizardDialog = dynamic(
  () =>
    import("@/components/profile/ProfileWizardDialog").then(
      (mod) => mod.ProfileWizardDialog
    ),
  { ssr: false }
);

interface DiscoverExplorerProps {
  scholarships: Scholarship[];
}

const LEVEL_OPTIONS = ["High School", "Undergraduate", "Postgraduate", "PhD"];
const FIELD_OPTIONS = [
  "STEM",
  "Business",
  "Medicine",
  "Social Sciences",
  "Law",
  "Arts",
  "Any",
];
const COUNTRY_OPTIONS = ["India", "USA", "UK", "Germany", "Canada", "Global"];
const TYPE_OPTIONS = ["Merit", "Need-based", "Diversity", "Research"];
const DEADLINE_WINDOWS = [
  { label: "Anytime", value: "any" },
  { label: "< 7 days", value: "7" },
  { label: "< 30 days", value: "30" },
  { label: "< 90 days", value: "90" },
];

export function DiscoverExplorer({ scholarships }: DiscoverExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useProfile();
  const mounted = useIsMounted();

  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = React.useState(false);

  // Read raw params from URL
  const queryParam = searchParams.get("q") || "";
  const levelsRaw = searchParams.get("level") || "";
  const fieldsRaw = searchParams.get("field") || "";
  const countriesRaw = searchParams.get("country") || "";
  const typesRaw = searchParams.get("type") || "";
  const minAmountParam = parseInt(searchParams.get("minAmount") || "0", 10);
  const deadlineWindowParam = (searchParams.get("deadline") || "any") as
    | "7"
    | "30"
    | "90"
    | "any";
  const sortParam = (searchParams.get("sort") ||
    (mounted && profile?.fieldOfStudy ? "match" : "deadline-soonest")) as
    | "match"
    | "deadline-soonest"
    | "amount-high"
    | "easiest";

  // Memoize array parses to preserve reference stability
  const levelsParam = React.useMemo(
    () => (levelsRaw ? levelsRaw.split(",").filter(Boolean) : []),
    [levelsRaw]
  );
  const fieldsParam = React.useMemo(
    () => (fieldsRaw ? fieldsRaw.split(",").filter(Boolean) : []),
    [fieldsRaw]
  );
  const countriesParam = React.useMemo(
    () => (countriesRaw ? countriesRaw.split(",").filter(Boolean) : []),
    [countriesRaw]
  );
  const typesParam = React.useMemo(
    () => (typesRaw ? typesRaw.split(",").filter(Boolean) : []),
    [typesRaw]
  );

  // Synchronize search input with URL param without cascading setState in effect
  const [prevQuery, setPrevQuery] = React.useState(queryParam);
  const [searchInput, setSearchInput] = React.useState(queryParam);

  if (prevQuery !== queryParam) {
    setPrevQuery(queryParam);
    setSearchInput(queryParam);
  }

  // Pagination state
  const [pageSize, setPageSize] = React.useState(12);

  // URL updater
  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all" || value === "any") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      setPageSize(12);
      const str = params.toString();
      router.replace(str ? `/discover?${str}` : "/discover", { scroll: false });
    },
    [router, searchParams]
  );

  // Debounced search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== queryParam) {
        updateParams({ q: searchInput.trim() || null });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, queryParam, updateParams]);

  // Multi-select toggle helper
  const toggleArrayParam = (paramName: string, itemValue: string) => {
    const current =
      searchParams.get(paramName)?.split(",").filter(Boolean) || [];
    const exists = current.includes(itemValue);
    const next = exists
      ? current.filter((x) => x !== itemValue)
      : [...current, itemValue];
    updateParams({ [paramName]: next.length > 0 ? next.join(",") : null });
  };

  const handleClearAll = () => {
    setSearchInput("");
    router.replace("/discover", { scroll: false });
  };

  // Run filter logic
  const { results, totalCount } = React.useMemo(() => {
    return filterAndSortScholarships(
      scholarships,
      {
        q: queryParam,
        level: levelsParam,
        field: fieldsParam,
        country: countriesParam,
        type: typesParam,
        minAmount: minAmountParam,
        deadlineWindow: deadlineWindowParam,
        sort: sortParam,
      },
      mounted ? profile : null
    );
  }, [
    scholarships,
    queryParam,
    levelsParam,
    fieldsParam,
    countriesParam,
    typesParam,
    minAmountParam,
    deadlineWindowParam,
    sortParam,
    profile,
    mounted,
  ]);

  const visibleResults = results.slice(0, pageSize);

  // Active filters count
  const activeFiltersCount =
    (queryParam ? 1 : 0) +
    levelsParam.length +
    fieldsParam.length +
    countriesParam.length +
    typesParam.length +
    (minAmountParam > 0 ? 1 : 0) +
    (deadlineWindowParam !== "any" ? 1 : 0);

  // Render filter controls (shared between desktop sidebar and mobile sheet)
  const renderFilterControls = () => (
    <div className="flex flex-col gap-6">
      {/* Education Level */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Education Level
        </label>
        <div className="flex flex-wrap gap-1.5">
          {LEVEL_OPTIONS.map((lvl) => {
            const isSelected = levelsParam.includes(lvl);
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => toggleArrayParam("level", lvl)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/15 text-foreground ring-1 ring-accent"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Field of Study */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Field of Study
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FIELD_OPTIONS.map((fld) => {
            const isSelected = fieldsParam.includes(fld);
            return (
              <button
                key={fld}
                type="button"
                onClick={() => toggleArrayParam("field", fld)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/15 text-foreground ring-1 ring-accent"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {fld}
              </button>
            );
          })}
        </div>
      </div>

      {/* Country / Region */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Country / Region
        </label>
        <div className="flex flex-wrap gap-1.5">
          {COUNTRY_OPTIONS.map((c) => {
            const isSelected = countriesParam.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleArrayParam("country", c)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/15 text-foreground ring-1 ring-accent"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scholarship Type */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Scholarship Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TYPE_OPTIONS.map((t) => {
            const isSelected = typesParam.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleArrayParam("type", t)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/15 text-foreground ring-1 ring-accent"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deadline Window */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Deadline Window
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {DEADLINE_WINDOWS.map((dw) => {
            const isSelected = deadlineWindowParam === dw.value;
            return (
              <button
                key={dw.value}
                type="button"
                onClick={() => updateParams({ deadline: dw.value })}
                className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors text-center ${
                  isSelected
                    ? "border-accent bg-accent/15 text-foreground ring-1 ring-accent"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {dw.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Funding Slider */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Min Funding (USD)
          </label>
          <span className="text-xs font-bold text-foreground">
            {minAmountParam > 0 ? `$${minAmountParam.toLocaleString()}+` : "Any amount"}
          </span>
        </div>
        <Slider
          value={[minAmountParam]}
          min={0}
          max={50000}
          step={2500}
          aria-label="Minimum funding in USD"
          onValueChange={(vals) => {
            const v = Array.isArray(vals) ? vals[0] : vals;
            updateParams({ minAmount: v && v > 0 ? String(v) : null });
          }}
          className="w-full py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$25k</span>
          <span>$50k+</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Top Banner: Profile Matching prompt */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent mt-0.5">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="font-heading text-lg font-bold text-foreground">
              {mounted && profile?.fieldOfStudy
                ? `Matched for: ${profile.educationLevel} in ${profile.fieldOfStudy}`
                : "Get your personalized match score"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {mounted && profile?.fieldOfStudy
                ? `Profile loaded from local storage. Showing tailored fit percentages across all ${scholarships.length} opportunities.`
                : "Answer 4 quick questions (GPA, field, education level) to calculate real-time match scores without an account."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={() => setWizardOpen(true)}
            className="min-h-[44px] gap-2 bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="size-4 text-accent" />
            <span>
              {mounted && profile?.fieldOfStudy
                ? "Edit Match Profile"
                : "Find My Matches"}
            </span>
          </Button>
        </div>
      </div>

      {/* Top 3 Personalized Strip (if profile exists) */}
      <TopMatchesStrip
        scholarships={scholarships}
        onEditProfile={() => setWizardOpen(true)}
      />

      {/* Main Explorer Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <aside
          aria-label="Filter sidebar"
          className="hidden lg:flex w-72 shrink-0 sticky top-20 flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-accent" />
              <h2 className="font-heading text-base font-bold text-foreground">
                Filter Programs
              </h2>
            </div>
            {activeFiltersCount > 0 ? (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-foreground underline hover:text-accent"
              >
                Clear all ({activeFiltersCount})
              </button>
            ) : null}
          </div>

          {renderFilterControls()}
        </aside>

        {/* Results Area */}
        <main className="flex-1 w-full flex-col gap-6">
          {/* Search Bar & Mobile Controls Bar */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name, provider, keyword, criteria..."
                  className="h-11 pl-10 pr-9 border-border bg-card text-foreground"
                  aria-label="Search scholarship records"
                />
                {searchInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParams({ q: null });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    aria-label="Clear search input"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>

              {/* Mobile Filter Button */}
              <div className="flex items-center gap-2 lg:hidden">
                <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                  <SheetTrigger
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground hover:bg-muted"
                    aria-label="Open filter sheet"
                  >
                    <Filter className="size-4 text-accent" />
                    <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="max-h-[90dvh] h-[85dvh] rounded-t-2xl border-t border-border bg-card p-6 overflow-y-auto"
                  >
                    <SheetHeader className="text-left border-b border-border pb-4">
                      <div className="flex items-center justify-between">
                        <SheetTitle className="font-heading text-xl font-bold text-foreground">
                          Filter Scholarships
                        </SheetTitle>
                        {activeFiltersCount > 0 ? (
                          <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-xs font-semibold text-foreground underline hover:text-accent"
                          >
                            Reset All
                          </button>
                        ) : null}
                      </div>
                    </SheetHeader>
                    <div className="py-6">{renderFilterControls()}</div>
                    <div className="sticky bottom-0 border-t border-border bg-card pt-4 pb-2">
                      <Button
                        onClick={() => setMobileSheetOpen(false)}
                        className="w-full min-h-[44px] bg-primary text-primary-foreground font-semibold"
                      >
                        Apply Filters ({totalCount} results)
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <ArrowUpDown className="size-4 text-muted-foreground shrink-0 hidden sm:block" />
                <label htmlFor="sort-select" className="sr-only">
                  Sort scholarships
                </label>
                <select
                  id="sort-select"
                  value={sortParam}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                  className="min-h-[44px] rounded-lg border border-border bg-card px-3 py-2 text-xs sm:text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="match">Best match %</option>
                  <option value="deadline-soonest">Deadline: Soonest</option>
                  <option value="amount-high">Funding: High to low</option>
                  <option value="easiest">Effort: Quickest to apply</option>
                </select>
              </div>
            </div>

            {/* Active Filters Row */}
            {activeFiltersCount > 0 ? (
              <div className="flex flex-wrap items-center gap-2 pt-1" aria-label="Active filters">
                <span className="text-xs text-muted-foreground font-medium">Active:</span>

                {queryParam ? (
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-md bg-secondary pl-2 pr-1 py-1 text-xs"
                  >
                    <span>&ldquo;{queryParam}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => updateParams({ q: null })}
                      className="p-0.5 hover:text-accent"
                      aria-label="Remove search filter"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ) : null}

                {levelsParam.map((lvl) => (
                  <Badge
                    key={lvl}
                    variant="secondary"
                    className="gap-1 rounded-md bg-secondary pl-2 pr-1 py-1 text-xs"
                  >
                    <span>{lvl}</span>
                    <button
                      type="button"
                      onClick={() => toggleArrayParam("level", lvl)}
                      className="p-0.5 hover:text-accent"
                      aria-label={`Remove ${lvl} level filter`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}

                {fieldsParam.map((fld) => (
                  <Badge
                    key={fld}
                    variant="secondary"
                    className="gap-1 rounded-md bg-secondary pl-2 pr-1 py-1 text-xs"
                  >
                    <span>{fld}</span>
                    <button
                      type="button"
                      onClick={() => toggleArrayParam("field", fld)}
                      className="p-0.5 hover:text-accent"
                      aria-label={`Remove ${fld} field filter`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}

                {countriesParam.map((c) => (
                  <Badge
                    key={c}
                    variant="secondary"
                    className="gap-1 rounded-md bg-secondary pl-2 pr-1 py-1 text-xs"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => toggleArrayParam("country", c)}
                      className="p-0.5 hover:text-accent"
                      aria-label={`Remove ${c} country filter`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}

                {typesParam.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="gap-1 rounded-md bg-secondary pl-2 pr-1 py-1 text-xs"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => toggleArrayParam("type", t)}
                      className="p-0.5 hover:text-accent"
                      aria-label={`Remove ${t} type filter`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}

                {minAmountParam > 0 ? (
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-md bg-secondary pl-2 pr-1 py-1 text-xs"
                  >
                    <span>Min ${minAmountParam.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => updateParams({ minAmount: null })}
                      className="p-0.5 hover:text-accent"
                      aria-label="Remove min amount filter"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ) : null}

                {deadlineWindowParam !== "any" ? (
                  <Badge
                    variant="secondary"
                    className="gap-1 rounded-md bg-secondary pl-2 pr-1 py-1 text-xs"
                  >
                    <span>Closing &lt; {deadlineWindowParam}d</span>
                    <button
                      type="button"
                      onClick={() => updateParams({ deadline: null })}
                      className="p-0.5 hover:text-accent"
                      aria-label="Remove deadline window filter"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ) : null}

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-semibold text-foreground underline hover:text-accent ml-1"
                >
                  Clear all
                </button>
              </div>
            ) : null}

            {/* Live Count */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span aria-live="polite" className="font-medium text-foreground">
                Showing {Math.min(visibleResults.length, totalCount)} of {totalCount}{" "}
                {totalCount === 1 ? "scholarship" : "scholarships"}
              </span>
            </div>
          </div>

          {/* Results Grid or Empty State */}
          {results.length > 0 ? (
            <div className="flex flex-col gap-8 pt-2">
              <LazyMotion features={domAnimation}>
                <m.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                >
                  {visibleResults.map((scholarship) => (
                    <m.div
                      key={scholarship.id}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <ScholarshipCard scholarship={scholarship} />
                    </m.div>
                  ))}
                </m.div>
              </LazyMotion>

              {/* Load More Button */}
              {visibleResults.length < results.length ? (
                <div className="flex flex-col items-center justify-center gap-2 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPageSize((prev) => prev + 12)}
                    className="min-h-[44px] rounded-xl border-border px-8 font-semibold text-foreground hover:bg-muted"
                  >
                    Load More Scholarships (
                    {results.length - visibleResults.length} remaining)
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Viewing {visibleResults.length} of {results.length} records
                  </span>
                </div>
              ) : null}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card mt-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 mb-4 text-accent">
                <SearchX className="size-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                No matching scholarships found
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                {activeFiltersCount > 1
                  ? "We couldn't find programs matching every selected parameter. Try loosening the country, field, or minimum funding criteria."
                  : "No scholarships currently match your search query. Try broader keywords or clearing your active filters."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleClearAll}
                  className="min-h-[44px] gap-2 bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <RotateCcw className="size-4 text-accent" />
                  <span>Reset All Filters</span>
                </Button>
                {minAmountParam > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => updateParams({ minAmount: null })}
                    className="min-h-[44px] border-border text-foreground hover:bg-muted"
                  >
                    Remove Min Amount Filter
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Profile Matching Wizard Dialog */}
      <ProfileWizardDialog
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onProfileSaved={() => updateParams({ sort: "match" })}
      />
    </div>
  );
}
