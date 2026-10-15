"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

// These classes beat Motion's inline styles (!important), so a reduced-motion visitor gets the final
// state from the first paint. useReducedMotion() cannot do that: the server does not know the
// setting and would ship a hidden headline.
const still = "motion-reduce:opacity-100! motion-reduce:transform-none!";

/**
 * One headline line, revealed word by word: 12px rise behind a clip mask, 60ms apart (hierarchy, and
 * the line is the promise). Every word is real text in the DOM; the mask carries its own descender
 * room so "today" keeps its tail at rest.
 */
export function HeroWords({ line, ember }: { line: string; ember?: string }) {
  const words = line.split(" ");
  return (
    <motion.span
      className="block"
      initial="hidden"
      animate="shown"
      variants={{ shown: { transition: { staggerChildren: 0.06 } } }}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="-mb-[0.16em] inline-flex overflow-hidden pb-[0.16em] align-bottom">
            <motion.span
              className={cn("inline-block", still, word === ember && "text-accent-text")}
              variants={{ hidden: { y: 12, opacity: 0 }, shown: { y: 0, opacity: 1, transition: spring } }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
