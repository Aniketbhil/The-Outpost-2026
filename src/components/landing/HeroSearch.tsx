"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, GraduationCap, Cpu, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/discover?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/discover");
    }
  };

  const quickFilters = [
    { label: "Undergraduate", param: "level=Undergraduate", icon: GraduationCap },
    { label: "STEM Fields", param: "field=STEM", icon: Cpu },
    { label: "India Opportunities", param: "country=India", icon: MapPin },
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Search Input Bar - responsive for 280px to desktop */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col sm:flex-row w-full items-stretch sm:items-center gap-2 sm:gap-0 rounded-xl border border-border bg-card p-1.5 shadow-card focus-within:border-accent focus-within:ring-2 focus-within:ring-ring sm:p-2"
      >
        <div className="flex items-center flex-1 min-w-0">
          <Search className="ml-2 sm:ml-3 size-4 sm:size-5 text-muted-foreground shrink-0" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by field, country, or provider..."
            className="h-10 sm:h-12 border-0 bg-transparent px-2 sm:px-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none shadow-none min-w-0"
            aria-label="Search scholarships"
          />
        </div>
        <Button
          type="submit"
          className="min-h-[44px] shrink-0 gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <span>Discover</span>
          <ArrowRight className="size-4 text-accent" aria-hidden="true" />
        </Button>
      </form>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-medium text-muted-foreground">Quick Filters:</span>
        {quickFilters.map((chip) => {
          const Icon = chip.icon;
          return (
            <button
              key={chip.param}
              type="button"
              onClick={() => router.push(`/discover?${chip.param}`)}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon className="size-3.5 text-accent" aria-hidden="true" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
