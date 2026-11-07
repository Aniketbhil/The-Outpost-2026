import { describe, it, expect } from "vitest";
import { scoreMatch } from "@/lib/match";
import type { Scholarship, UserProfile } from "@/lib/types";

const mockScholarship: Scholarship = {
  id: "sch-test-1",
  slug: "stem-fellowship",
  name: "National STEM Leadership Fellowship",
  provider: "National Science Foundation",
  amount: 25000,
  currency: "USD",
  coverage: "Full tuition",
  level: "Undergraduate",
  field: "STEM",
  country: "USA",
  type: "Merit",
  deadline: "2026-12-15",
  renewable: true,
  minGpa: 3.5,
  summary: "Annual grant for high-achieving STEM scholars.",
  description: "Comprehensive support for undergraduate STEM students.",
  eligibility: ["Undergraduate student", "STEM major", "US citizen", "Min 3.5 GPA"],
  documents: ["Transcript", "Recommendation Letter"],
  steps: ["Submit application", "Interview"],
  estimatedMinutes: 60,
  applyUrl: "https://example.org/apply",
  featured: true,
};

describe("scoreMatch", () => {
  it("returns score 0 and empty reasons when profile is null or undefined", () => {
    expect(scoreMatch(mockScholarship, null)).toEqual({ score: 0, reasons: [] });
    expect(scoreMatch(mockScholarship, undefined)).toEqual({ score: 0, reasons: [] });
  });

  it("calculates a high match score (>= 90%) for a perfectly aligned profile", () => {
    const perfectProfile: UserProfile = {
      name: "Jane Doe",
      educationLevel: "Undergraduate",
      fieldOfStudy: "Computer Science",
      country: "USA",
      gpa: "3.9",
      financialNeed: true,
      interests: ["Tech", "Leadership"],
    };

    const result = scoreMatch(mockScholarship, perfectProfile);
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.reasons.length).toBeGreaterThan(0);
    const gpaReason = result.reasons.find((r) => r.label.toLowerCase().includes("gpa"));
    expect(gpaReason?.met).toBe(true);
  });

  it("penalizes score when GPA is below the required threshold", () => {
    const lowGpaProfile: UserProfile = {
      name: "John Doe",
      educationLevel: "Undergraduate",
      fieldOfStudy: "Computer Science",
      country: "USA",
      gpa: "2.8",
      financialNeed: true,
      interests: [],
    };

    const result = scoreMatch(mockScholarship, lowGpaProfile);
    const gpaReason = result.reasons.find((r) => r.label.toLowerCase().includes("gpa"));
    expect(gpaReason?.met).toBe(false);
    expect(result.score).toBeLessThanOrEqual(85);
  });

  it("handles edge GPA boundary values properly (e.g. invalid GPA strings)", () => {
    const edgeProfile: UserProfile = {
      name: "Edge Case",
      educationLevel: "Undergraduate",
      fieldOfStudy: "STEM",
      country: "USA",
      gpa: "not-a-number",
      financialNeed: false,
      interests: [],
    };

    const result = scoreMatch(mockScholarship, edgeProfile);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
