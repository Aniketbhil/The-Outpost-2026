import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScholarshipCard } from "@/components/scholarship/ScholarshipCard";
import type { Scholarship } from "@/lib/types";

const mockScholarship: Scholarship = {
  id: "sch-card-test",
  slug: "test-excellence-award",
  name: "Global Excellence Scholarship",
  provider: "Oxford Foundation",
  amount: 30000,
  currency: "GBP",
  coverage: "Full tuition",
  level: "Postgraduate",
  field: "STEM",
  country: "UK",
  type: "Merit",
  deadline: "2026-12-01",
  renewable: true,
  minGpa: 3.8,
  summary: "Prestigious award for graduate research in technology.",
  description: "Detailed description here.",
  eligibility: ["First-class degree", "UK study"],
  documents: ["Transcript", "Research Statement"],
  steps: ["Online form", "Review"],
  estimatedMinutes: 45,
  applyUrl: "https://example.org/apply",
  featured: true,
};

describe("ScholarshipCard Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders scholarship name, provider, amount, and coverage correctly", () => {
    render(<ScholarshipCard scholarship={mockScholarship} />);

    expect(screen.getByText("Global Excellence Scholarship")).toBeInTheDocument();
    expect(screen.getByText("Oxford Foundation")).toBeInTheDocument();
    expect(screen.getByText("Full tuition")).toBeInTheDocument();
    expect(screen.getByText("Postgraduate")).toBeInTheDocument();
  });

  it("toggles bookmark/save state when save button is clicked", () => {
    render(<ScholarshipCard scholarship={mockScholarship} />);

    const saveBtn = screen.getByRole("button", {
      name: /Save Global Excellence Scholarship to tracker/i,
    });
    expect(saveBtn).toBeInTheDocument();

    fireEvent.click(saveBtn);

    const savedBtn = screen.getByRole("button", {
      name: /Remove Global Excellence Scholarship from tracker/i,
    });
    expect(savedBtn).toBeInTheDocument();
  });
});
