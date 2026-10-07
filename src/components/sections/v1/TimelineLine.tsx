"use client";

import { motion, useScroll } from "motion/react";
import { type ReactNode, useRef } from "react";

/**
 * The rail beside the timeline. Draws with scroll (useScroll + pathLength): it shows progress through the fix.
 * Reduced motion: drawn in full from the start (CSS beats the dash attributes Motion writes, so no JS timing).
 */
export function TimelineLine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.5"] });

  return (
    <div ref={ref} className="relative">
      <svg aria-hidden viewBox="0 0 2 100" preserveAspectRatio="none" className="absolute top-2 bottom-2 left-[3px] h-[calc(100%-1rem)] w-0.5 overflow-visible">
        <path d="M1 0V100" className="stroke-line" strokeWidth={2} fill="none" />
        <motion.path
          d="M1 0V100"
          className="stroke-accent motion-reduce:[stroke-dasharray:none]"
          strokeWidth={2}
          fill="none"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      {children}
    </div>
  );
}
