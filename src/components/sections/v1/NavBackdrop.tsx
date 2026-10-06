"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useState } from "react";

/**
 * The nav's surface layer. Fades in once the page scrolls past 8px.
 * Communicates state: content is now passing under the bar, so the bar needs its own surface.
 * Opacity only, so the blur and border never animate layout. Motion useScroll, no scroll listener.
 */
export function NavBackdrop() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 -z-10 border-b border-line bg-surface/85 backdrop-blur-md"
      initial={false}
      animate={{ opacity: scrolled ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 100, damping: 20 }}
    />
  );
}
