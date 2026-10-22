"use client";

import { useEffect, useState } from "react";

/**
 * Where the reader is in a seven-section page, shown at the foot of the sticky conversion card.
 *
 * It reads the rendered `h2[id]` out of the DOM rather than taking a list of titles as a prop,
 * because the service page's sections are conditional: symptoms or who-it-is-for, guides only when
 * the service has any, the quote only when a real one exists, related only when the content lists
 * any. A prop would mean restating four conditions and seven strings beside the JSX that already
 * encodes them, and nothing in the build would catch the two drifting apart.
 *
 * ponytail: reads h2[id] from the DOM so the ticks cannot drift from the conditional sections. If a
 * template ever needs ticks that are not derived from headings, pass a list instead.
 *
 * It is aria-hidden and has no controls on purpose. A screen reader already has the real heading
 * outline, so this is orientation for sighted scroll-readers only, which keeps it out of the
 * landmark order and gives it no keyboard surface to get wrong.
 */
export function ReadingRail() {
  // One state object, written only from the observer. The headings are read from the DOM, so they
  // cannot be known until after mount, and filling them from the effect body instead would be the
  // cascading-render pattern react-hooks/set-state-in-effect exists to stop. An observer calls back
  // once on observe, so the first frame of ticks arrives from the same place every later one does.
  const [rail, setRail] = useState<{ headings: string[]; active: number }>({ headings: [], active: 0 });

  useEffect(() => {
    const found = Array.from(document.querySelectorAll<HTMLHeadingElement>("[data-rail-scope] h2[id]"));
    if (found.length < 3) return;
    const headings = found.map((h) => h.textContent ?? "");

    const io = new IntersectionObserver(
      () => {
        // The topmost heading currently inside the reading band wins. Measured from the live list
        // rather than from the callback's entries, so a scroll that crosses two at once still lands
        // on the right one, and one that crosses none keeps the section the reader is already in.
        const i = found.findIndex((h) => {
          const { top, bottom } = h.getBoundingClientRect();
          return bottom > 96 && top < window.innerHeight * 0.45;
        });
        setRail((prev) => ({ headings, active: i === -1 ? prev.active : i }));
      },
      // 96px clears the 64px fixed header and the margin scroll-padding-top already reserves.
      { rootMargin: "-96px 0px -55% 0px", threshold: [0, 1] },
    );
    found.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  const { headings, active } = rail;
  if (headings.length < 3) return null;

  return (
    <div aria-hidden className="mt-5 border-t border-line pt-5">
      <div className="flex gap-1.5">
        {headings.map((h, i) => (
          <span
            key={h}
            className={`h-0.5 flex-1 rounded-[14px] transition-colors duration-300 ${i === active ? "bg-accent" : "bg-line-strong"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">{headings[active]}</p>
    </div>
  );
}
