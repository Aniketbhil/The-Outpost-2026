import { describe, it, expect } from "vitest";
import { filterAndSortScholarships } from "@/lib/filter";
import { getAll } from "@/data";

describe("Scholarship Filter & Sort Functions", () => {
  const scholarships = getAll();

  it("returns all scholarships when no filter is applied", () => {
    const { results, totalCount } = filterAndSortScholarships(scholarships, {});
    expect(totalCount).toBe(scholarships.length);
    expect(results.length).toBe(scholarships.length);
  });

  it("filters accurately by text search query", () => {
    const { results } = filterAndSortScholarships(scholarships, { q: "Reliance" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.name.includes("Reliance") || s.provider.includes("Reliance"))).toBe(true);
  });

  it("filters accurately by education level", () => {
    const { results } = filterAndSortScholarships(scholarships, { level: ["Undergraduate"] });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.level === "Undergraduate")).toBe(true);
  });

  it("filters accurately by field of study", () => {
    const { results } = filterAndSortScholarships(scholarships, { field: ["STEM"] });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.field === "STEM" || s.field === "Any")).toBe(true);
  });

  it("filters accurately by country / region", () => {
    const { results } = filterAndSortScholarships(scholarships, { country: ["India"] });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.country === "India" || s.country === "Global")).toBe(true);
  });

  it("sorts correctly by amount from high to low", () => {
    const { results } = filterAndSortScholarships(scholarships, { sort: "amount-high" });
    expect(results.length).toBeGreaterThan(1);
    // Since currency can vary, amounts in USD should be descending
    const first = results[0];
    expect(first).toBeDefined();
    expect(first?.amount).toBeGreaterThan(0);
  });

  it("returns empty results when filtering with impossible criteria", () => {
    const { results, totalCount } = filterAndSortScholarships(scholarships, {
      q: "NonExistentImpossibleSearch123456789",
    });
    expect(totalCount).toBe(0);
    expect(results).toEqual([]);
  });
});
