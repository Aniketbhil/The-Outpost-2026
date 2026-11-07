import { SCHOLARSHIPS } from "./scholarships";
import type { Scholarship } from "@/lib/types";

export { SCHOLARSHIPS };

export const STATIC_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.28,
  INR: 0.012, // ~ 83 INR = 1 USD
};

export function getAll(): Scholarship[] {
  return SCHOLARSHIPS;
}

export function getBySlug(slug: string): Scholarship | undefined {
  return SCHOLARSHIPS.find((s) => s.slug === slug);
}

export function getRelated(slug: string, limit = 3): Scholarship[] {
  const current = getBySlug(slug);
  if (!current) return SCHOLARSHIPS.slice(0, limit);

  return SCHOLARSHIPS.filter((s) => s.slug !== slug)
    .map((s) => {
      let score = 0;
      if (s.field === current.field) score += 3;
      if (s.level === current.level) score += 2;
      if (s.country === current.country) score += 2;
      if (s.type === current.type) score += 1;
      return { scholarship: s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.scholarship);
}

export function getFeatured(): Scholarship[] {
  return SCHOLARSHIPS.filter((s) => s.featured);
}

export function getClosingSoon(n = 6): Scholarship[] {
  return [...SCHOLARSHIPS]
    .sort(
      (a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )
    .slice(0, n);
}

export interface AggregateStats {
  count: number;
  totalFundingUSD: number;
  closingThisMonth: number;
}

export function getAggregateStats(): AggregateStats {
  const count = SCHOLARSHIPS.length;
  let totalUSD = 0;

  for (const s of SCHOLARSHIPS) {
    const rate = STATIC_RATES_TO_USD[s.currency] ?? 1.0;
    totalUSD += s.amount * rate;
  }

  // Calculate closing soon within next 35 days (fixed relative to current time 2026-11-07)
  const nowTime = new Date("2026-11-07T00:00:00.000Z").getTime();
  const windowTime = nowTime + 35 * 24 * 60 * 60 * 1000;

  const closingThisMonth = SCHOLARSHIPS.filter((s) => {
    const dTime = new Date(s.deadline).getTime();
    return dTime >= nowTime && dTime <= windowTime;
  }).length;

  return {
    count,
    totalFundingUSD: Math.round(totalUSD),
    closingThisMonth,
  };
}
