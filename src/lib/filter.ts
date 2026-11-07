import type { Scholarship, UserProfile } from "./types";
import { scoreMatch } from "./match";
import { STATIC_RATES_TO_USD } from "@/data";

export interface FilterParams {
  q?: string;
  level?: string[];
  field?: string[];
  country?: string[];
  type?: string[];
  coverage?: string[];
  minAmount?: number;
  deadlineWindow?: "7" | "30" | "90" | "any";
  renewable?: boolean | null;
  sort?: "match" | "deadline-soonest" | "amount-high" | "easiest";
}

function assertNever(x: never): never {
  throw new Error(`Unhandled sort option: ${JSON.stringify(x)}`);
}

/**
 * Normalizes amount to USD for cross-currency comparisons
 */
export function getAmountInUSD(scholarship: Scholarship): number {
  const rate = STATIC_RATES_TO_USD[scholarship.currency] ?? 1.0;
  return scholarship.amount * rate;
}

/**
 * Pure function to filter and sort scholarships based on URL parameters and optional user profile.
 */
export function filterAndSortScholarships(
  scholarships: Scholarship[],
  params: FilterParams,
  profile?: UserProfile | null
): { results: Scholarship[]; totalCount: number } {
  const query = (params.q || "").trim().toLowerCase();
  const levels = params.level || [];
  const fields = params.field || [];
  const countries = params.country || [];
  const types = params.type || [];
  const coverages = params.coverage || [];
  const minAmount = params.minAmount || 0;
  const deadlineWindow = params.deadlineWindow || "any";
  const renewable = params.renewable;
  const sort = params.sort || (profile && profile.fieldOfStudy ? "match" : "deadline-soonest");

  // Fixed reference time for deadline calculations (2026-11-07)
  const now = new Date("2026-11-07T00:00:00.000Z").getTime();

  const filtered = scholarships.filter((s) => {
    // 1. Text Search Query
    if (query) {
      const matchName = s.name.toLowerCase().includes(query);
      const matchProvider = s.provider.toLowerCase().includes(query);
      const matchSummary = s.summary.toLowerCase().includes(query);
      const matchField = s.field.toLowerCase().includes(query);
      const matchCountry = s.country.toLowerCase().includes(query);
      const matchEligibility = s.eligibility.some((e) =>
        e.toLowerCase().includes(query)
      );

      if (
        !matchName &&
        !matchProvider &&
        !matchSummary &&
        !matchField &&
        !matchCountry &&
        !matchEligibility
      ) {
        return false;
      }
    }

    // 2. Education Level
    if (levels.length > 0 && !levels.includes(s.level)) {
      return false;
    }

    // 3. Field of Study
    if (fields.length > 0) {
      if (s.field !== "Any" && !fields.includes(s.field)) {
        return false;
      }
    }

    // 4. Country
    if (countries.length > 0) {
      if (s.country !== "Global" && !countries.includes(s.country)) {
        return false;
      }
    }

    // 5. Scholarship Type
    if (types.length > 0 && !types.includes(s.type)) {
      return false;
    }

    // 6. Coverage Type
    if (coverages.length > 0 && !coverages.includes(s.coverage)) {
      return false;
    }

    // 7. Minimum Amount (normalized to USD approximation)
    if (minAmount > 0) {
      const amountUSD = getAmountInUSD(s);
      if (amountUSD < minAmount) {
        return false;
      }
    }

    // 8. Deadline Window
    if (deadlineWindow !== "any") {
      const windowDays = parseInt(deadlineWindow, 10);
      if (!isNaN(windowDays)) {
        const sDeadline = new Date(s.deadline).getTime();
        const maxTime = now + windowDays * 24 * 60 * 60 * 1000;
        if (sDeadline < now || sDeadline > maxTime) {
          return false;
        }
      }
    }

    // 9. Renewable
    if (typeof renewable === "boolean") {
      if (s.renewable !== renewable) {
        return false;
      }
    }

    return true;
  });

  // Sorting (exhaustive switch with never check)
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "match": {
        const scoreA = profile ? scoreMatch(a, profile).score : a.featured ? 100 : 50;
        const scoreB = profile ? scoreMatch(b, profile).score : b.featured ? 100 : 50;
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        // secondary sort by deadline
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      case "amount-high":
        return getAmountInUSD(b) - getAmountInUSD(a);
      case "easiest":
        return a.estimatedMinutes - b.estimatedMinutes;
      case "deadline-soonest":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return assertNever(sort);
    }
  });

  return {
    results: sorted,
    totalCount: filtered.length,
  };
}
