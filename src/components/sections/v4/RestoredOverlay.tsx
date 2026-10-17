"use client";

import { motion, useReducedMotion } from "motion/react";

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;
// Beats Motion's inline transform, so a reduced-motion visitor has the finished state from the first
// paint rather than a headline the server shipped at opacity 0. Motion writes `transform`, which is
// what transform-none cancels; Tailwind's own scale/translate utilities would need a different cancel.
const still = "motion-reduce:opacity-100! motion-reduce:transform-none!";

/**
 * The section's words, centred on the frame and arriving the first time it comes into view: headline,
 * then the line under it. Same spring and stagger as the quote pair, so the page has one reveal
 * rather than two dialects of one.
 *
 * A flat --photo-scrim, never a gradient, and --on-photo rather than --muted: muted over a
 * photograph measures 2.55:1, the pairing the critical problem tiles rejected for the same reason.
 * pointer-events-none throughout, so copy on the frame never costs a drag on the comparison.
 */
export function RestoredOverlay() {
  const reduce = useReducedMotion();
  return (
    <>
      <span aria-hidden className="absolute inset-0 bg-photo-scrim" />
      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.5 }}
        variants={{ shown: { transition: { staggerChildren: reduce ? 0 : 0.12 } } }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center md:p-10"
      >
        <motion.h2
          id="same-site"
          variants={{ hidden: { opacity: 0, y: reduce ? 0 : 12 }, shown: { opacity: 1, y: 0, transition: spring } }}
          className={`font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] text-on-photo [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48] ${still}`}
        >
          Same site. Working again.
        </motion.h2>
        <motion.p
          variants={{ hidden: { opacity: 0, y: reduce ? 0 : 12 }, shown: { opacity: 1, y: 0, transition: spring } }}
          className={`mt-4 max-w-[52ch] text-lg text-on-photo ${still}`}
        >
          The same pages, the same content, the same theme. Nothing rebuilt, nothing redesigned.
        </motion.p>
      </motion.div>
    </>
  );
}
