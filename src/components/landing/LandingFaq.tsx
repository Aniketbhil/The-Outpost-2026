"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "faq-1",
    question: "Is Grantly completely free and private?",
    answer:
      "Yes, 100%. Grantly has no backend servers, no tracking databases, and requires zero user sign-ups. Your profile preferences and tracked scholarships live entirely in your browser's localStorage.",
  },
  {
    id: "faq-2",
    question: "How does the scholarship match score work?",
    answer:
      "Our match scoring algorithm runs locally in your browser. It compares your degree level, major/field, country of residence or citizenship, GPA, and financial need against verified eligibility rules to deliver a 0–100% fit score with clear explanations.",
  },
  {
    id: "faq-3",
    question: "Where does Grantly's scholarship data come from?",
    answer:
      "Every scholarship in our catalogue features fixed deadlines, verified foundation/institutional providers, direct official application links, and transparent eligibility criteria with detailed checklist requirements.",
  },
  {
    id: "faq-4",
    question: "How do application checklists and tracking work?",
    answer:
      "Once you bookmark a scholarship, it appears in your personal Tracker workspace. You can categorize progress across Saved, Preparing, Applied, and Awarded stages, check off required documents like transcripts and recommendation letters, and save custom application notes.",
  },
];

export function LandingFaq() {
  return (
    <Accordion className="w-full">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="border-b border-border py-1"
        >
          <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-foreground transition-colors hover:text-accent hover:no-underline py-4">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-5">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
