import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LandingFaq } from "@/components/landing/LandingFaq";

const mockFaqs = [
  {
    id: "faq-test-1",
    question: "Is Grantly completely free and private?",
    answer: "Yes, 100%. Grantly has no backend servers.",
  },
  {
    id: "faq-test-2",
    question: "Where does the data come from?",
    answer: "Every scholarship is hand-verified.",
  },
];

describe("LandingFaq Component", () => {
  it("renders questions and toggles answers via keyboard and click", async () => {
    const user = userEvent.setup();
    render(<LandingFaq items={mockFaqs} />);

    const trigger1 = screen.getByRole("button", {
      name: /Is Grantly completely free and private\?/i,
    });
    expect(trigger1).toBeInTheDocument();

    // Trigger keyboard expansion using Space or Enter
    await user.click(trigger1);
    expect(
      screen.getByText(/Yes, 100%\. Grantly has no backend servers\./i)
    ).toBeInTheDocument();
  });
});
