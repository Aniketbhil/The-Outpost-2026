import { describe, it, expect } from "vitest";
import {
  parseSearchParams,
  isValidApplyUrl,
  sanitizeSearchQuery,
} from "@/lib/params";

describe("URL Params Parser & Security Validator", () => {
  it("parses valid URLSearchParams correctly", () => {
    const params = new URLSearchParams({
      q: "engineering",
      level: "Undergraduate",
      field: "STEM",
      country: "USA",
      type: "Merit",
      coverage: "Full tuition",
      minAmount: "15000",
      deadline: "30",
      renewable: "true",
      sort: "amount-high",
      page: "2",
    });

    const parsed = parseSearchParams(params);
    expect(parsed.q).toBe("engineering");
    expect(parsed.level).toEqual(["Undergraduate"]);
    expect(parsed.field).toEqual(["STEM"]);
    expect(parsed.country).toEqual(["USA"]);
    expect(parsed.type).toEqual(["Merit"]);
    expect(parsed.coverage).toEqual(["Full tuition"]);
    expect(parsed.minAmount).toBe(15000);
    expect(parsed.deadlineWindow).toBe("30");
    expect(parsed.renewable).toBe(true);
    expect(parsed.sort).toBe("amount-high");
    expect(parsed.page).toBe(2);
  });

  it("filters out disallowed/malicious parameter values and uses safe defaults", () => {
    const maliciousParams = {
      q: "<script>alert('xss')</script>",
      level: ["Undergraduate", "HackerLevel", "../../../etc/passwd"],
      field: ["MaliciousField", "STEM"],
      country: "InvalidCountry",
      type: "FakeType",
      coverage: "NotReal",
      minAmount: "-5000",
      deadline: "invalidWindow",
      sort: "drop_tables",
      page: "-10",
    };

    const parsed = parseSearchParams(maliciousParams as unknown as Record<string, string[]>);
    expect(parsed.level).toEqual(["Undergraduate"]);
    expect(parsed.field).toEqual(["STEM"]);
    expect(parsed.country).toEqual([]);
    expect(parsed.type).toEqual([]);
    expect(parsed.coverage).toEqual([]);
    expect(parsed.minAmount).toBe(0);
    expect(parsed.deadlineWindow).toBe("any");
    expect(parsed.sort).toBe("deadline-soonest");
    expect(parsed.page).toBe(1);
    expect(parsed.q).not.toContain("\u0000");
  });

  it("sanitizes long text search queries by truncating to 100 characters", () => {
    const longQuery = "a".repeat(250);
    expect(sanitizeSearchQuery(longQuery).length).toBe(100);
  });

  it("validates applyUrl protocol strictly (http/https only)", () => {
    expect(isValidApplyUrl("https://scholarships.org/apply")).toBe(true);
    expect(isValidApplyUrl("http://mit.edu/fellowship")).toBe(true);
    expect(isValidApplyUrl("javascript:alert(1)")).toBe(false);
    expect(isValidApplyUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isValidApplyUrl("#")).toBe(false);
    expect(isValidApplyUrl("")).toBe(false);
    expect(isValidApplyUrl(null)).toBe(false);
  });
});
