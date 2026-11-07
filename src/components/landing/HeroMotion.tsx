"use client";

import { m, LazyMotion, domAnimation } from "motion/react";
import { HeroSearch } from "./HeroSearch";
import { Sparkles } from "lucide-react";

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
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-foreground">
              <Sparkles className="size-3.5 text-accent" />
              <span>Free &bull; Local-First &bull; No Sign-Up Needed</span>
            </div>
          </m.div>

          {/* Fraunces Headline */}
          <m.h1
            variants={itemVariants}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
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

        {/* Right Column: Tasteful SVG/CSS Accent Graphic */}
        <div className="relative flex items-center justify-center lg:col-span-5" aria-hidden="true">
          <div className="relative size-72 sm:size-88 lg:size-96">
            {/* Ambient subtle glow ring */}
            <div className="absolute inset-0 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-3xl" />

            {/* Concentric orbital SVG graphic */}
            <svg
              className="absolute inset-0 size-full"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer dashed ring */}
              <circle
                cx="200"
                cy="200"
                r="170"
                stroke="currentColor"
                className="text-border"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />

              {/* Middle boundary ring */}
              <circle
                cx="200"
                cy="200"
                r="120"
                stroke="currentColor"
                className="text-border"
                strokeWidth="1.5"
              />

              {/* Inner focus circle */}
              <circle
                cx="200"
                cy="200"
                r="70"
                stroke="currentColor"
                className="text-accent/60"
                strokeWidth="2"
              />

              {/* Crosshair guide marks */}
              <line
                x1="200"
                y1="15"
                x2="200"
                y2="55"
                stroke="currentColor"
                className="text-accent"
                strokeWidth="2"
              />
              <line
                x1="200"
                y1="345"
                x2="200"
                y2="385"
                stroke="currentColor"
                className="text-accent"
                strokeWidth="2"
              />
              <line
                x1="15"
                y1="200"
                x2="55"
                y2="200"
                stroke="currentColor"
                className="text-accent"
                strokeWidth="2"
              />
              <line
                x1="345"
                y1="200"
                x2="385"
                y2="200"
                stroke="currentColor"
                className="text-accent"
                strokeWidth="2"
              />

              {/* Orbiting accent nodes */}
              <circle cx="200" cy="80" r="6" className="fill-accent" />
              <circle cx="305" cy="260" r="5" className="fill-accent opacity-75" />
              <circle cx="95" cy="260" r="4" className="fill-accent opacity-60" />

              {/* Central core node */}
              <circle cx="200" cy="200" r="28" className="fill-card stroke-accent" strokeWidth="2" />
              <circle cx="200" cy="200" r="10" className="fill-accent" />
            </svg>

            {/* Overlaid minimal metric chip */}
            <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-4 rounded-xl border border-border bg-card/95 p-3.5 shadow-card backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="size-2.5 rounded-full bg-accent animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-medium text-muted-foreground">Match Engine</span>
                  <span className="font-heading text-sm font-bold text-foreground">100% Client-Side</span>
                </div>
              </div>
            </div>

            {/* Overlaid secondary metric chip */}
            <div className="absolute -top-2 -right-2 sm:top-4 sm:right-4 rounded-xl border border-border bg-card/95 p-3.5 shadow-card backdrop-blur-md">
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-medium text-muted-foreground">Applications</span>
                <span className="font-heading text-sm font-bold text-foreground">Zero Deadlines Missed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
