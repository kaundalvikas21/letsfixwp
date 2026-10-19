"use client";

import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef, useState, type ReactNode } from "react";

// Progress through the section's crossing of the viewport that the travel is mapped onto, and these
// two numbers are the whole feel of it. Mapped across the full crossing, the row was already 219px
// along by the time the cards reached the bottom of the screen, so the first one was sliding away
// before anyone had read it. 0.33 is where the cards sit comfortably in view and 0.78 is where they
// start leaving the top, so the row holds still while you meet it and has finished by the time it
// goes. It travels about one and a half times the page's own speed through that window, which is
// the kinetic part, and the part a visitor can take over whenever they want to.
const FROM = 0.33;
const TO = 0.78;

/**
 * The five moves on one line, walking sideways as the page scrolls past them.
 *
 * It does not take the scroll over. The section is an ordinary 757px block in the flow and the page
 * keeps scrolling vertically the whole time; what reads the scroll is the rail's own position,
 * mapped to how far the section has crossed the viewport. Scrolling down walks the row along, and
 * scrolling back up walks it back.
 *
 * What is driven is `scrollLeft`, not a transform, and that is the whole reason this works. A
 * transform would be a second position on top of the one the rail already has, so a swipe and the
 * scroll would each move the row and the two would add up into somewhere unreachable. Sharing one
 * value means the browser clamps it, the scrollbar agrees with it, and a swipe simply takes over.
 *
 * And it does take over: touch the rail and the drive stops for good. Without the pin there is not
 * enough page scroll left to walk 1104px of row at a readable pace, so the drive gets you moving and
 * your own hand gets you the rest, at whatever pace you want. The one thing a scroll-linked rail
 * must never do is carry a card away from someone in the middle of reading it.
 *
 * The mapping runs through a spring at the contract's stiffness 100 and damping 20. A raw
 * scroll-linked value arrives in wheel-sized steps; the spring eases toward where the scroll says
 * the row should be, and lets a flick settle rather than stop dead.
 *
 * Under reduced motion nothing is driven: the same rail, scrolled only by hand.
 */
export function FixRail({ children, label }: { children: ReactNode; label: string }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: viewport, offset: ["start end", "end start"] });
  const eased = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  useMotionValueEvent(eased, "change", (v) => {
    const vp = viewport.current;
    if (!vp || manual || reduce) return;
    // Measured every frame rather than cached: the travel changes with the window, the font, and
    // whether a capture has landed in a card yet.
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 0) return;
    const t = Math.min(1, Math.max(0, (v - FROM) / (TO - FROM)));
    vp.scrollLeft = t * max;
  });

  const yours = () => setManual(true);

  return (
    <div
      ref={viewport}
      role="region"
      aria-label={label}
      tabIndex={0}
      onPointerDown={yours}
      onWheel={(e) => e.deltaX !== 0 && yours()}
      onKeyDown={yours}
      // The rail runs the full width of the window and a card mid-row is cut off by the window
      // itself, which is what says there is more of it. Both ends are the page spine, computed
      // rather than inherited: half of whatever is left over beyond the 72rem container, plus the
      // container's own 1.5rem, with max() holding it at 1.5rem once the window is narrower than
      // the container. So the row starts under the heading and ends under the button, and it is only
      // in between that anything runs off an edge. The right was 1.5rem flat before, which left the
      // last card 24px from the window against the first card's 168px, and that end read as clipped
      // even though it was not. No scroll-snap: the drive sets scrollLeft on every frame and
      // snapping would fight it for the last few pixels of every one.
      className="mt-10 overflow-x-auto px-4 pb-1 md:mt-12 md:px-[max(1.5rem,calc((100%-72rem)/2+1.5rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max gap-6 md:gap-8">{children}</div>
    </div>
  );
}
