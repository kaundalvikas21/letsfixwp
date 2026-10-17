"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// The same strong ease-out the closing block uses: the eye sees movement immediately, which is what
// makes half a second read as fast.
const EASE = [0.23, 1, 0.32, 1] as const;

// These beat Motion's inline styles, so a reduced-motion visitor gets the final state from the first
// paint rather than five hidden rows waiting for hydration. transform-none works here because Motion
// writes a real `transform`, unlike Tailwind's scale-* utilities, which write `scale`.
const still = "motion-reduce:opacity-100! motion-reduce:transform-none!";

// The row grid lives here rather than in the section, because this component owns the <li>. The
// section owns what goes inside one.
const ROW =
  "group relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 border-b border-line py-5 md:grid-cols-[1.25rem_minmax(0,19rem)_minmax(0,1fr)] md:items-start md:gap-x-8 md:py-7";

/**
 * The five practices arrive one after another as the section comes into view, and the row under the
 * pointer lights its own hairline.
 *
 * What the arrival communicates: these are five separate promises, not one paragraph of reassurance.
 * Read in sequence they land as a list of commitments; arriving together they would read as a block
 * of text to skip. Once only, and only on the way down: a trust list that replays every time the
 * section crosses the fold would be decoration.
 *
 * The hover is the ember rail from the fix scene, one row wide. It travels left to right under the
 * row, which is the reading direction, and says "this line" without claiming the row is a link,
 * which it is not (DESIGN.md's Hover Earns It Rule). Tailwind v4 already gates every hover: variant
 * behind (hover: hover), so a tap on a phone does not fire it.
 */
export function PracticeRows({ children }: { children: ReactNode[] }) {
  const reduce = useReducedMotion();
  return (
    <motion.ul
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ shown: { transition: { staggerChildren: reduce ? 0 : 0.055 } } }}
      className="mt-10 border-t border-line md:mt-12"
    >
      {children.map((child, i) => (
        <motion.li
          key={i}
          className={`${ROW} ${still}`}
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 14 },
            shown: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: EASE } },
          }}
        >
          {child}
          {/* Sits exactly on the row's own hairline rather than beside it, so the ember replaces the
              line instead of thickening the row by a pixel. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100 motion-reduce:transition-none"
          />
        </motion.li>
      ))}
    </motion.ul>
  );
}
