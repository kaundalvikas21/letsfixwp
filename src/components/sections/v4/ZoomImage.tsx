"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * The capture grows from 70% to full width as it travels up the viewport. Scale only, on a box that
 * never changes size, so nothing below it moves. This is the third scroll scene on the page and the
 * only one that does not pin: the two pins are spent on the break and the fix.
 *
 * Reduced motion gets the full-width still from the first paint: the class beats Motion's inline
 * transform, which the server cannot know to leave out.
 */
export function ZoomImage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);

  return (
    <div ref={ref} className="mt-10">
      <motion.div style={{ scale }} className="origin-center motion-reduce:transform-none!">
        {children}
      </motion.div>
    </div>
  );
}
