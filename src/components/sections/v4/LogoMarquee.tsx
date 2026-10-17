"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The one marquee on the page (contract rule 3). It carries no information of its own: every logo is
 * in the DOM, each with its own title, and reduced motion renders the set as a static wrapped row.
 * Motion stops on hover, on focus inside it, and on the pause button, which is WCAG 2.2.2.
 */
export function LogoMarquee({ logos }: { logos: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const [offScreen, setOffScreen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // A 42s loop that never stops is a loop running for the whole time the tab is open, on a page that
  // is about 18,000px tall and where this strip is visible for a fraction of it. Nonessential motion
  // stops when it is off screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffScreen(!e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="relative mt-8">
      <div className="marquee-fade overflow-hidden">
        <div
          data-paused={paused || offScreen}
          className="flex w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] data-[paused=true]:[animation-play-state:paused] motion-safe:animate-[marquee_42s_linear_infinite] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-8"
        >
          <ul className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-8 motion-reduce:pr-0">
            {logos}
          </ul>
          {/* Two more copies, decoration of decoration. Three in total: the shift is one copy, and what
              is left after it still has to cover the window. Keep this count in step with the
              -33.3333% in the marquee keyframe. */}
          <ul aria-hidden className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden">
            {logos}
          </ul>
          <ul aria-hidden className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden">
            {logos}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex justify-center motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[14px] border border-line-strong bg-surface px-4 text-[15px] font-medium active:scale-[0.98]"
        >
          {paused ? <PlayIcon weight="duotone" className="size-4" aria-hidden /> : <PauseIcon weight="duotone" className="size-4" aria-hidden />}
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
