"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// A strong ease-out: the eye sees movement immediately, which is what makes 500ms read as fast.
const EASE = [0.23, 1, 0.32, 1] as const;

// These beat Motion's inline styles, so a reduced-motion visitor gets the final state from the first
// paint rather than a hidden block waiting for hydration.
const still = "motion-reduce:opacity-100! motion-reduce:transform-none!";

/** The closing block arrives once, 60ms apart, bottom to top of the reading order. */
export function CtaReveal({ children }: { children: ReactNode[] }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ shown: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          className={still}
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 14 },
            shown: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: EASE } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
