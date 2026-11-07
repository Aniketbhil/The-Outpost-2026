"use client";

import * as React from "react";
import { Award, DollarSign, CalendarClock } from "lucide-react";

interface StatStripProps {
  count: number;
  totalFundingUSD: number;
  closingThisMonth: number;
}

export function StatStrip({
  count,
  totalFundingUSD,
  closingThisMonth,
}: StatStripProps) {
  const [inView, setInView] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Animated values
  const [displayCount, setDisplayCount] = React.useState(0);
  const [displayFunding, setDisplayFunding] = React.useState(0);
  const [displayClosing, setDisplayClosing] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView) return;

    let animHandle: number;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      animHandle = requestAnimationFrame(() => {
        setDisplayCount(count);
        setDisplayFunding(totalFundingUSD);
        setDisplayClosing(closingThisMonth);
      });
      return () => cancelAnimationFrame(animHandle);
    }

    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplayCount(Math.round(ease * count));
      setDisplayFunding(Math.round(ease * totalFundingUSD));
      setDisplayClosing(Math.round(ease * closingThisMonth));

      if (progress < 1) {
        animHandle = requestAnimationFrame(animate);
      }
    };

    animHandle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animHandle);
  }, [inView, count, totalFundingUSD, closingThisMonth]);

  // Format funding display
  const formattedFunding = displayFunding >= 1000000
    ? `$${(displayFunding / 1000000).toFixed(1)}M+`
    : `$${Math.round(displayFunding / 1000)}k+`;

  const stats = [
    {
      label: "Active Verified Scholarships",
      value: `${displayCount}+`,
      subtext: "Across India, USA, UK, Germany & Global",
      icon: Award,
    },
    {
      label: "Total Estimated Funding",
      value: formattedFunding,
      subtext: "Full rides, partial tuition & research stipends",
      icon: DollarSign,
    },
    {
      label: "Closing Within 35 Days",
      value: `${displayClosing}`,
      subtext: "Prioritize upcoming winter deadlines",
      icon: CalendarClock,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 divide-y divide-border rounded-2xl border border-border bg-card shadow-card sm:grid-cols-3 sm:divide-x sm:divide-y-0"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex flex-col gap-2 p-6 sm:p-8 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-accent" />
              <span className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <div className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground tabular-nums break-words">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
