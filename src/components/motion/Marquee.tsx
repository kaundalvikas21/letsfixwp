"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { marqueeSeconds } from "./tokens";

/**
 * An infinite strip that stops when anyone looks like they want it to.
 *
 * **This primitive is CSS, not Motion, and that is a deliberate exception to rule 8.** A linear
 * loop that runs for as long as the tab is open is the exact case where a CSS animation wins: it
 * runs off the main thread, so it stays smooth while the page is loading or hydrating, where a
 * `requestAnimationFrame` loop drops frames. There is also nothing for Motion to buy here, since
 * the animation is never interrupted, retargeted or velocity-handed-off. The rest of this folder is
 * Motion; this one is not, and the reason is performance rather than preference.
 *
 * **Contract rule 9 wants more than hover-pause**, so this has all of it: it stops on hover, on
 * focus anywhere inside it, on a real `aria-pressed` pause button, and whenever it scrolls out of
 * view. The last one is not an accessibility requirement but a courtesy: a 40s loop on an 18,000px
 * page would otherwise animate for the whole visit while visible for a fraction of it.
 *
 * **Contract rule 3 allows one marquee per page.** There is no runtime guard for that; it is a
 * review rule. The logo strip on the home page is the one that exists today.
 *
 * Under reduced motion the track stops being a track: it renders as a single static wrapped row,
 * the duplicate copies are removed from the DOM flow and the pause button is hidden, because there
 * is nothing left to pause.
 *
 * Three copies of the children, not two. The keyframe shifts by exactly one third, so one copy is a
 * whole repeat unit and the seam never drifts; what is left after the shift still has to fill the
 * window, and two copies left a blank strip at the end of each loop on a 1152px container. Keep the
 * copy count and the `-33.3333%` in `@keyframes marquee` in step.
 */
export function Marquee({
  children,
  seconds = marqueeSeconds,
  className,
  label,
}: {
  /** One copy of the strip's contents, as `li` elements. */
  children: ReactNode;
  /** Loop length. Linear, because a loop that eases is a loop you can watch restart. */
  seconds?: number;
  className?: string;
  /** Describes the strip for assistive tech, e.g. "Platforms we repair". */
  label?: string;
}) {
  const [paused, setPaused] = useState(false);
  const [offScreen, setOffScreen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffScreen(!e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className={className ?? "relative mt-8"}>
      <div className="marquee-fade overflow-hidden">
        <div
          data-paused={paused || offScreen}
          style={{ animationDuration: `${seconds}s` }}
          className="flex w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] data-[paused=true]:[animation-play-state:paused] motion-safe:animate-[marquee_linear_infinite] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-8"
        >
          <ul
            aria-label={label}
            className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-8 motion-reduce:pr-0"
          >
            {children}
          </ul>
          {/* Decoration of decoration: hidden from assistive tech, removed under reduced motion. */}
          <ul aria-hidden className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden">
            {children}
          </ul>
          <ul aria-hidden className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden">
            {children}
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
