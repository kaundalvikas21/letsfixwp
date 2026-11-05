"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ElementType } from "react";
import { MotionFeatures } from "./MotionFeatures";
import { duration, easing, viewport } from "./tokens";

/**
 * A numeral counting up to its value the first time it comes into view.
 *
 * **The final value is in the server HTML.** The element renders its real number, and the count
 * only replaces it once the client has both run and decided to animate. Three things follow, and
 * they are the reasons it is built this way rather than starting from zero:
 *
 * - With JS disabled or the bundle blocked, the page shows the number (rule 9).
 * - A screen reader reads the value, not a blur of intermediate ones: the counting node is
 *   `aria-hidden` and the real figure sits beside it in a visually hidden span (rule 9 again).
 * - The box never resizes mid-count, because the widest state is the final one and it is what
 *   reserved the space. `tabular-nums` on the caller's class is what keeps the digits from
 *   jittering; `CountUp` adds it itself so a caller cannot forget.
 *
 * `duration.countUp` is 1.2s, the longest value in the table. A numeral counting is the one
 * animation whose whole job is to be watched, and under about a second it reads as a glitch.
 */
export function CountUp({
  value,
  className,
  as: Tag = "span",
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
  once = true,
  distance,
  direction,
}: {
  /** The real figure. Comes from `src/content` or `getSiteStatus()`, never typed in (contract rule 8). */
  value: number;
  className?: string;
  as?: ElementType;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Milliseconds to hold after the element comes into view. */
  delay?: number;
  once?: boolean;
  /** Accepted for API symmetry; a counting numeral does not travel. Ignored. */
  distance?: number;
  /** Accepted for API symmetry; a counting numeral does not travel. Ignored. */
  direction?: string;
}) {
  void distance;
  void direction;
  return (
    <MotionFeatures>
      <Counter
        value={value}
        className={className}
        as={Tag}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        delay={delay}
        once={once}
      />
    </MotionFeatures>
  );
}

function Counter({
  value,
  className,
  as: Tag,
  prefix,
  suffix,
  decimals,
  delay,
  once,
}: {
  value: number;
  className?: string;
  as: ElementType;
  prefix: string;
  suffix: string;
  decimals: number;
  delay: number;
  once: boolean;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(box, { once, amount: viewport.amount, margin: viewport.margin });

  const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = digits.current;
    if (!el || !inView || reduce) return;
    // Starts from zero only here, in an effect, so the server-rendered markup keeps the real
    // figure and a blocked bundle leaves it standing.
    const controls = animate(0, value, {
      duration: duration.countUp,
      delay: delay / 1000,
      ease: [...easing],
      onUpdate: (n) => {
        el.textContent = format(n);
      },
      onComplete: () => {
        el.textContent = format(value);
      },
    });
    return () => controls.stop();
    // `format` is derived from the formatting props, which are all in the list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, delay, decimals, prefix, suffix]);

  return (
    <Tag ref={box} className={className ? `tabular-nums ${className}` : "tabular-nums"}>
      {/* The figure a screen reader reads, and the only one in the accessibility tree. */}
      <span className="sr-only">{format(value)}</span>
      <span ref={digits} aria-hidden>
        {format(value)}
      </span>
    </Tag>
  );
}
