"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { useState, type ReactNode } from "react";

/**
 * The one marquee on the page (contract rule 3). It carries no information of its own: every logo is
 * in the DOM, each with its own title, and reduced motion renders the set as a static wrapped row.
 * Motion stops on hover, on focus inside it, and on the pause button, which is WCAG 2.2.2.
 */
export function LogoMarquee({ logos }: { logos: ReactNode }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative mt-8">
      <div className="overflow-hidden">
        <div
          data-paused={paused}
          className="flex w-max gap-12 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] data-[paused=true]:[animation-play-state:paused] motion-safe:animate-[marquee_42s_linear_infinite] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-8"
        >
          <ul className="flex shrink-0 items-center gap-12 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-8">
            {logos}
          </ul>
          {/* The second copy is what makes the loop join without a visible seam; it is decoration of decoration. */}
          <ul aria-hidden className="flex shrink-0 items-center gap-12 motion-reduce:hidden">
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
