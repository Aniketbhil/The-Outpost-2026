import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

describe("Formatting and Date Utilities", () => {
  beforeEach(() => {
    // Freeze time to 2026-11-07T00:00:00.000Z
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-07T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats currencies correctly (USD, EUR, GBP, INR)", () => {
    expect(formatCurrency(25000, "USD")).toContain("25,000");
    expect(formatCurrency(15000, "EUR")).toContain("15.000");
    expect(formatCurrency(12000, "GBP")).toContain("12,000");
    expect(formatCurrency(200000, "INR")).toContain("2,00,000");
  });

  it("formats dates gracefully and handles malformed strings without throwing", () => {
    const formatted = formatDate("2026-12-15");
    expect(formatted).toContain("2026");
    expect(formatDate("invalid-date-string")).toBe("invalid-date-string");
    expect(formatDate("")).toBe("");
  });

  it("calculates daysUntil deterministically against frozen system time", () => {
    // Current time is 2026-11-07
    expect(daysUntil("2026-11-07")).toBe(0);
    expect(daysUntil("2026-11-10")).toBe(3);
    expect(daysUntil("2026-11-05")).toBe(-2);
  });
});
