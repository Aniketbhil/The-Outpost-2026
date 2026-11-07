"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS, type FaqItem } from "@/data";

interface LandingFaqProps {
  items?: FaqItem[];
}

export function LandingFaq({ items = FAQS }: LandingFaqProps) {
  return (
    <Accordion className="w-full divide-y divide-border">
      {items.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="border-b border-border py-1"
        >
          <AccordionTrigger className="min-h-[48px] py-4 text-left text-base sm:text-lg font-semibold text-foreground transition-colors hover:text-accent focus-visible:ring-ring">
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
