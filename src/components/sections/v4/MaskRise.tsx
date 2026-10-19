"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * One line of display type rising out of its own clip box the first time it comes into view.
 *
 * The page already owns this move in two places, the panel labels in the error row and the answers
 * in the FAQ, so the closing line arrives in the page's own vocabulary rather than a new one. The
 * clip is what separates it from a plain fade: the words come up from behind an edge instead of
 * materialising where they stand.
 *
 * The trigger is on the clip box, not on the line inside it, and that is not a stylistic choice. A
 * line starting at translateY(100%) inside an overflow-hidden parent is entirely clipped, and an
 * IntersectionObserver measures what is left after an ancestor clips it: nothing. Put whileInView on
 * the inner span and its ratio is zero for as long as it is hidden, so it is never told to appear
 * and the last thing the page says never shows up. The box is doing the clipping rather than being
 * clipped, so it sees the viewport honestly and hands the line its cue.
 *
 * Spring stiffness 100 and damping 20, the contract's own, so it settles rather than stops. Reduced
 * motion gets the final state from the first paint, carried by the Tailwind overrides rather than by
 * hydration, so a blocked bundle cannot leave the closing line invisible. transform-none, not
 * translate-none: Motion writes a real `transform`, where Tailwind's own utilities write `translate`.
 */
export function MaskRise({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={`block overflow-hidden ${className ?? ""}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.span
        className="block motion-reduce:transform-none! motion-reduce:opacity-100!"
        variants={{ hidden: { y: "100%", opacity: 0 }, shown: { y: "0%", opacity: 1 } }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
