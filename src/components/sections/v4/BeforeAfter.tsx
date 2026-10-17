"use client";

import { useState, type ReactNode } from "react";

/**
 * The same screen, broken and fixed, with the visitor doing the reveal. Drag the divider and the
 * repair happens under their hand, which is the one thing this section can say that a static pair
 * cannot.
 *
 * The control is a real range input stretched over the frame at zero opacity. That is the whole
 * accessibility story: pointer drag, touch drag and arrow keys all come from the platform, the thumb
 * is a genuine focus target, and nothing here has to re-implement a gesture or fight the page for
 * the scroll. `touch-action: pan-y` keeps a vertical swipe scrolling the page instead of being
 * swallowed by the slider.
 *
 * `overlay` is the section's copy sitting on the media. It renders before the input so the input
 * stays on top, and it carries pointer-events-none, so text over the frame never costs a drag.
 */
export function BeforeAfter({ before, after, label, overlay }: { before: ReactNode; after: ReactNode; label: string; overlay?: ReactNode }) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative overflow-hidden rounded-[14px] border border-line bg-surface-2 p-2 shadow-card">
      <div className="relative overflow-hidden rounded-[14px]">
        {/* After sits underneath at full width; before is clipped to the divider, so the two are
            always the same size and nothing reflows as the handle moves. */}
        {after}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {before}
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-[2px] bg-accent" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[14px] border border-line-strong bg-surface">
            <span className="block h-4 w-[2px] bg-text" />
            <span className="absolute block h-4 w-[2px] translate-x-[5px] bg-text" />
            <span className="absolute block h-4 w-[2px] -translate-x-[5px] bg-text" />
          </span>
        </div>

        {overlay}

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={label}
          className="absolute inset-0 size-full cursor-ew-resize touch-pan-y appearance-none bg-transparent opacity-0"
        />
      </div>
    </div>
  );
}
