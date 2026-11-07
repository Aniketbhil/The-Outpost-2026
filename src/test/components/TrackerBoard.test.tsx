import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TrackerBoard } from "@/components/tracker/TrackerBoard";
import { store } from "@/lib/store";
import { getAll } from "@/data";

describe("TrackerBoard Component", () => {
  const scholarships = getAll();

  beforeEach(() => {
    window.localStorage.clear();
    store.resetTracker();
  });

  it("shows empty state when no items are tracked, and seeds demo data on action click", () => {
    render(<TrackerBoard scholarships={scholarships} />);

    expect(screen.getByText(/Your application tracker is empty/i)).toBeInTheDocument();

    const loadDemoBtns = screen.getAllByRole("button", { name: /Load demo/i });
    expect(loadDemoBtns.length).toBeGreaterThan(0);

    fireEvent.click(loadDemoBtns[0]);

    // After loading demo data, summary row and columns appear
    expect(screen.getByText(/Total Tracked/i)).toBeInTheDocument();
    expect(screen.getByText(/Funding in Play/i)).toBeInTheDocument();
  });
});
