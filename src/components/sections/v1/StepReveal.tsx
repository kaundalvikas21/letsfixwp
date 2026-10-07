"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

/**
 * One timeline step entering on first view (MASTER.md motion vocabulary: spring entrance, opacity and y).
 * What it communicates: hierarchy, you take the fix one step at a time as you reach it.
 *
 * Reduced motion: `animate` forces the final state on mount, so the row is settled without ever waiting for the
 * viewport. It cannot be done with `initial={false}` instead: useReducedMotion() is null during SSR, so the
 * hidden initial style is already in the HTML by the time the client learns the preference, and with nothing to
 * animate to the row would stay at opacity 0 for good. MotionConfig is wrong here for the reason BentoCell gives,
 * it collapses the transition but still applies the y offset.
 */
export function StepReveal({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties; // the card's sticky offset, which differs per step so it cannot be a utility class
}) {
  const reduce = useReducedMotion();

  return (
    <motion.li
      className={className}
      style={style}
      initial={{ opacity: 0, y: 16 }}
      animate={reduce ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
    >
      {children}
    </motion.li>
  );
}
