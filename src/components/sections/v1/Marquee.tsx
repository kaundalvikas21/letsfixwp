"use client";

import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const btn =
  "inline-flex size-11 cursor-pointer items-center justify-center rounded-control text-muted transition-transform duration-150 hover:text-text active:scale-[0.98]";

/**
 * CSS-transform marquee. Communicates breadth: the platforms we work on keep coming.
 * Pauses on hover, on keyboard focus of previous / next, when the pause button is pressed, and while offscreen.
 * (Focus on the pause button itself does not pause, or pressing Play would appear to do nothing.)
 * Previous / next nudge the row by one logo (contract rule 9). Under reduced motion the CSS shows a static
 * centered row and hides the controls, so nothing here needs to run.
 */
export function Marquee({ children, label }: { children: ReactNode; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [offset, setOffset] = useState(0); // px, kept within one set width
  const [wrapping, setWrapping] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting));
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  const nudge = (dir: 1 | -1) => {
    const set = track.current?.firstElementChild as HTMLElement | null;
    if (!set) return;
    const setWidth = set.getBoundingClientRect().width;
    const step = setWidth / Math.max(1, set.children.length);
    let next = offset - dir * step;
    const wraps = next <= -setWidth || next > 0;
    if (next <= -setWidth) next += setWidth;
    if (next > 0) next -= setWidth;
    setPaused(true);
    setWrapping(wraps); // jump without a transition when crossing the seam
    setOffset(next);
  };

  const stopped = paused || offscreen;

  return (
    <div ref={root} className="group">
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none]">
        <div
          style={{ transform: `translateX(${offset}px)` }}
          className={wrapping ? "" : "transition-transform duration-300 ease-out motion-reduce:transition-none"}
        >
          <div
            ref={track}
            aria-label={label}
            role="group"
            data-paused={stopped || undefined}
            className="flex w-max animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused] group-has-[[data-nudge]:focus-visible]:[animation-play-state:paused] data-[paused]:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center"
          >
            {children}
          </div>
        </div>
      </div>

      <div role="group" aria-label="Logo scroll controls" className="mt-4 flex justify-end gap-2 motion-reduce:hidden">
        <button type="button" data-nudge className={btn} aria-label="Previous logos" onClick={() => nudge(-1)}>
          <CaretLeft size={18} aria-hidden />
        </button>
        <button
          type="button"
          className={btn}
          aria-label={paused ? "Play logo scroll" : "Pause logo scroll"}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
        </button>
        <button type="button" data-nudge className={btn} aria-label="Next logos" onClick={() => nudge(1)}>
          <CaretRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}
