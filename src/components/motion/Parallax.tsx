"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { MotionFeatures } from "./MotionFeatures";
import { mobileBreakpoint } from "./tokens";

/**
 * A y-offset tied to the element's own progress through the viewport. Nothing else moves.
 *
 * **It is off below 768px and off under reduced motion**, which is brief rules 10 and 3. Neither is
 * a graceful degradation: on a phone a parallax layer competes with the scroll the thumb is
 * driving, so the element renders at its resting offset with no transform at all.
 *
 * **The measured box and the moving box are two different elements, on purpose.** A transform
 * changes an element's own bounding rect, so an element used as its own `useScroll` target feeds
 * its offset back into the progress that produced it. The outer element is static and is what gets
 * measured; the inner one is the only thing that moves. That split is also what holds CLS at zero
 * (rule 5): the outer box occupies its final size from the first paint and never changes.
 *
 * The travel is clamped at both ends. `useTransform` extrapolates past a two-point input range by
 * default, so an element parked well above or below the viewport would keep accumulating offset and
 * drift out of its frame.
 */
export function Parallax({
  children,
  className,
  as: Tag = "div",
  distance = 60,
  direction = "up",
  delay,
  once,
}: {
  children: ReactNode;
  className?: string;
  /** The static outer element. Any tag: it carries no Motion and is never transformed. */
  as?: ElementType;
  /** Total travel in px across the element's full pass through the viewport. */
  distance?: number;
  /** `up` moves the layer against the scroll, which reads as depth behind the page. */
  direction?: "up" | "down";
  /** Accepted for API symmetry. A scroll-linked value has no start to delay, so it is ignored. */
  delay?: number;
  /** Accepted for API symmetry. A scroll-linked value is continuous, never one-shot, so it is ignored. */
  once?: boolean;
}) {
  void delay;
  void once;
  const box = useRef<HTMLDivElement>(null);
  return (
    <MotionFeatures>
      <Tag ref={box} className={className}>
        <Layer box={box} distance={distance} direction={direction}>
          {children}
        </Layer>
      </Tag>
    </MotionFeatures>
  );
}

function Layer({
  children,
  box,
  distance,
  direction,
}: {
  children: ReactNode;
  box: React.RefObject<HTMLDivElement | null>;
  distance: number;
  direction: "up" | "down";
}) {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);

  // Read on the client only, and keep reading: a window dragged across the breakpoint has to pick
  // the parallax up or drop it without a reload. The server renders the resting state either way,
  // so there is no flash and nothing for hydration to reconcile (rule 7).
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${mobileBreakpoint}px)`);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const travel = direction === "up" ? -distance : distance;
  const y = useTransform(scrollYProgress, [0, 1], [-travel / 2, travel / 2], { clamp: true });

  return <m.div style={wide && !reduce ? { y } : undefined}>{children}</m.div>;
}
