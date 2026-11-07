"use client";

import { m, useScroll, useSpring, LazyMotion, domAnimation } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left bg-accent pointer-events-none"
        style={{ scaleX }}
      />
    </LazyMotion>
  );
}
