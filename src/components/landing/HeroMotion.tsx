"use client";

import { m, LazyMotion, domAnimation } from "motion/react";
import { HeroSearch } from "./HeroSearch";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroMotion() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" as const },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Staggered Content & Search */}
        <m.div
          className="flex flex-col items-start gap-6 lg:col-span-7"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow badge */}
          <m.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold text-foreground shadow-subtle">
              <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
              <span>Free &bull; Local-First &bull; No Sign-Up Needed</span>
            </div>
          </m.div>

          {/* Sora Headline */}
          <m.h1
            variants={itemVariants}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]"
          >
            Find it<span className="text-accent">.</span> Fit it<span className="text-accent">.</span> Finish it<span className="text-accent">.</span>
          </m.h1>

          {/* One-line subcopy */}
          <m.p
            variants={itemVariants}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            The focused, privacy-first scholarship discovery and deadline tracking workspace that puts student eligibility first.
          </m.p>

          {/* Search bar & quick filters */}
          <m.div variants={itemVariants} className="w-full max-w-xl pt-2">
            <HeroSearch />
          </m.div>
        </m.div>

        {/* Right Column: Clean Editorial Preview Card */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-card hover:-translate-y-0.5 transition-transform duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-muted-foreground">Curated Fit</span>
                <span className="font-heading text-base font-bold text-foreground">Global STEM Excellence</span>
              </div>
              <span className="inline-flex items-center rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                98% fit
              </span>
            </div>
            <div className="py-4 flex flex-col gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Institutional Award</span>
              <div className="font-heading text-3xl font-bold tracking-tight text-foreground tabular-nums">
                $45,000
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full tuition plus annual research stipend for undergraduate engineering &amp; computing scholars.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
              <span>Deadline: Dec 15, 2026</span>
              <Link
                href="/discover"
                className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-accent transition-colors"
              >
                <span>Browse Directory</span>
                <ArrowRight className="size-3 text-accent" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
