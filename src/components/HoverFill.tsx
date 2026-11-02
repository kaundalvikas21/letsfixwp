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
  fill = "bg-surface-2",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  /** The fill's colour, as a token utility. Must keep the box's own text at 4.5:1 over it. */
  fill?: string;
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
    <div
      ref={box}
      onPointerEnter={mark}
      onPointerLeave={mark}
      className={cn("group relative isolate overflow-hidden", className)}
      {...rest}
    >
      <span
        aria-hidden
        style={{ left: "var(--fill-x, 50%)", top: "var(--fill-y, 50%)" }}
        className={cn(
          "pointer-events-none absolute -z-10 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full",
          "transition-[scale] duration-[650ms] ease-[var(--motion-ease)] motion-reduce:transition-none",
          "[@media(hover:hover)]:group-hover:scale-100",
          fill,
        )}
      />
      {children}
    </div>
  );
}
