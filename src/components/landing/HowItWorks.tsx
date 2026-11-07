"use client";

import { m, LazyMotion, domAnimation } from "motion/react";
import { Compass, Sparkles, BookmarkCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Discover Verified Grants",
    description:
      "Explore 30+ verified institutional and foundation scholarships across India, USA, UK, Germany, and globally. Zero sponsored ads or dead aggregator links.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Instant Fit Scoring",
    description:
      "Our dependency-free matching engine compares your education level, field, country, and GPA to deliver an instant 0–100% fit score with clear criterion breakdowns.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Track & Complete",
    description:
      "Organize requirements from preparation to submission. Check off transcripts and recommendation letters with automatic deadline countdowns saved in your browser.",
    icon: BookmarkCheck,
  },
];

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" as const },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <m.div
              key={item.step}
              variants={cardVariants}
              className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card transition-all duration-200 hover:border-accent/40"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <Icon className="size-6 text-accent" />
                  </div>
                  <span className="font-heading text-2xl font-bold text-muted-foreground/40">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-foreground">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 ? (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 rounded-full border border-border bg-background p-1.5 shadow-sm">
                  <ArrowRight className="size-3.5 text-accent" />
                </div>
              ) : null}
            </m.div>
          );
        })}
      </m.div>
    </LazyMotion>
  );
}
