"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Bento cell shell. Hover: spring lift of 2px and a doubled --line border (a second border layer fading in,
 * so only transform and opacity animate). Communicates feedback: the cell responds to the pointer.
 * Image cells never scale. Reduced motion: no lift at all (MotionConfig would still jump to y -2).
 */
export function BentoCell({ className, children }: { className: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`group relative isolate overflow-hidden rounded-card border border-line shadow-card ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card border border-[rgb(255_255_255/0.16)] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
    </motion.div>
  );
}
