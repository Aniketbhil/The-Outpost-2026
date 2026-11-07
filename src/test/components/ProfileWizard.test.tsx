import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileWizardDialog } from "@/components/profile/ProfileWizardDialog";

describe("ProfileWizardDialog Component", () => {
  it("renders step 1 and advances through steps", () => {
    const onOpenChange = vi.fn();
    render(<ProfileWizardDialog open={true} onOpenChange={onOpenChange} />);

    // Step 1: Education Level
    expect(
      screen.getByText(/What is your current education level\?/i)
    ).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /Continue/i });
    expect(nextBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);

    // Step 2: Field of Study
    expect(
      screen.getByText(/Which academic field are you in\?/i)
    ).toBeInTheDocument();
  });
});
