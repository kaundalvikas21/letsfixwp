"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useOpenPalette } from "./ProblemSearch";

const spring = { type: "spring", stiffness: 100, damping: 20 } as const;

// Reduced motion: these classes beat Motion's inline styles (!important), so the final state shows from the
// first paint. useReducedMotion() cannot do that here: the server does not know the setting and would ship hidden cells.
const still = "motion-reduce:opacity-100! motion-reduce:transform-none!";

/**
 * The bento grid. One in-view trigger for the whole grid, then cells rise in reading order 60ms apart, so the eye
 * follows the grid and a fast scroll can never leave a cell hidden.
 */
export function BentoGrid({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.ul
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ staggerChildren: 0.06 }}
    >
      {children}
    </motion.ul>
  );
}

/** A grid cell. Hover lifts 1.02 to say the cell is a link. */
export function BentoCell({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.li
      className={cn(className, still)}
      variants={{ hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0, transition: spring } }}
      whileHover={{ scale: 1.02, transition: spring }}
    >
      {children}
    </motion.li>
  );
}

/** Cell 7: opens the command palette instead of navigating, so "all problems" is one search away. */
export function SeeAllButton({ count, className }: { count: number; className?: string }) {
  const open = useOpenPalette();
  return (
    <button type="button" onClick={open} className={cn("cursor-pointer text-left", className)}>
      <MagnifyingGlassIcon weight="duotone" className="size-6" aria-hidden />
      <span className="mt-auto block font-display text-2xl leading-tight font-bold">See all {count} problems</span>
      <span className="mt-1 block text-sm">Search by what your site is doing</span>
    </button>
  );
}
