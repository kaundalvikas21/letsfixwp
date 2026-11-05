"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A box whose hover fill grows out of the cursor, and collapses back towards wherever it leaves.
 *
 * It replaced a `scale-x` wipe from `origin-left`, which swept the same way whichever edge the
 * pointer came in at: entering from the right meant watching the fill travel away from the cursor
 * and then back under it. Growing from the contact point is the move the buttons already make with
 * their expanding circle, so the site has one vocabulary for "something filled under the pointer"
 * rather than two.
 *
 * **It is a client leaf because there is no CSS for this.** A stylesheet cannot know where a
 * pointer is, so the two coordinates are written to custom properties on `pointerenter` and again
 * on `pointerleave`. Everything after that is CSS: the circle is positioned at those properties and
 * only `scale` animates, which keeps contract rule 10 (transform and opacity only) and keeps the
 * work off the main thread.
 *
 * The properties default to `50%`, so the fill grows from the middle when nothing has set them:
 * a touch device that fires no pointerenter, a keyboard user, or a blocked bundle. The component
 * degrades to a centred fill rather than to a broken one.
 *
 * **Sizing.** The circle has to cover the box from any point on it, including a corner, so its
 * radius must beat the box's diagonal. `w-[250%] aspect-square` gives a square two and a half times
 * the box's width, which on cells far wider than they are tall clears the diagonal several times
 * over. The overflow clip hides the rest, and nothing but `scale` ever animates, so the size costs
 * a paint area and not a layout.
 *
 * Hover only, behind `(hover: hover)`: a tap would otherwise leave a box filled with no way to
 * clear it. Under reduced motion the transition goes and the state change arrives instantly, which
 * is the same trade `PracticeRows` makes, and deliberately not `scale-100!`, which would pin every
 * box permanently filled.
 */
export function HoverFill({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & Record<string, unknown>) {
  const box = useRef<HTMLDivElement>(null);

  // Both handlers do the same thing, which is why they are one function: the fill grows from where
  // the pointer arrived and shrinks back towards where it left.
  const mark = (e: PointerEvent<HTMLDivElement>) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fill-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--fill-y", `${e.clientY - r.top}px`);
  };

  return (
    // One element, not two. The fill is `hover-fill`'s `::before` in globals.css, which is what lets
    // this sit inside a `dl` as the `div` wrapping a `dt`/`dd` pair: that content model admits no
    // decorative child element, and the span this used to render made the About stats strip invalid.
    <div ref={box} onPointerEnter={mark} onPointerLeave={mark} className={cn("hover-fill group", className)} {...rest}>
      {children}
    </div>
  );
}
