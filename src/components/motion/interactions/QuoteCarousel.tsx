"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Quote = {
  name: string;
  role: string;
  org: string;
  excerpt: string;
  placeholder?: boolean;
  /**
   * This client's video slot, rendered by the server and handed in, the way ExpandingRows takes its
   * `image`. A node rather than an id, so the frame stays a Server Component and no part of
   * src/content/videos.ts is pulled into this client island.
   */
  media?: ReactNode;
};

/**
 * Client stories, one card per view, paged by hand.
 *
 * **No library and no Motion.** The whole mechanism is `snap-x snap-mandatory scroll-smooth` on the
 * rail plus one `scrollIntoView` per press. `scrollIntoView` with no `behavior` argument inherits the
 * scroller's computed `scroll-behavior`, so `motion-reduce:scroll-auto` is the entire reduced-motion
 * implementation and there is no JS branch that can drift from the CSS. `block: "nearest"` is
 * load-bearing: without it, paging a horizontal rail also scrolls the page vertically to centre the
 * slide it just moved to.
 *
 * **No autoplay, and that is a contract position rather than a preference.** The logo marquee sits in
 * this same section and is the page's one auto-moving track, which rule 3 caps at one. It would also
 * fight the content: an advancing slide can pull a clip away from someone who just pressed play.
 * Which is what makes rule 9 straightforward here. Previous and next are real buttons; the stops on
 * hover, focus and reduced motion are vacuous because nothing moves on its own; and pause is not
 * applicable because there is nothing to pause.
 *
 * Nothing is animated. Scroll position is not an animated property, and the dots change state with no
 * transition on purpose: a width transition would be a layout animation, which rule 10 forbids. What
 * the movement communicates is that there is more than one client story, and which one you are on.
 *
 * Roles follow the APG carousel pattern: a labelled `group` with `aria-roledescription="carousel"`, a
 * real list inside it so the slides keep list semantics, and a per-slide "n of m" label. No live
 * region, because nothing changes here without the visitor asking for it.
 */
export function QuoteCarousel({
  quotes,
  label,
  action,
}: {
  quotes: Quote[];
  label: string;
  /**
   * The section's one link, rendered into the controls row beside the counter rather than stranded
   * on its own line under the carousel. Passed in as a node so the link stays a Server Component and
   * its href keeps coming from src/config/routes.ts, which is the only place hrefs may come from.
   */
  action?: ReactNode;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const ratios = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const count = quotes.length;

  // Which slide is showing, from an observer rooted on the rail rather than a scroll listener: rule 6
  // bans window scroll listeners, and Marquee already made the observer the house answer to "is this
  // in view". The ratio per slide is kept across callbacks, because a callback only carries the
  // slides whose visibility just changed, so picking the best of one batch would let a slide that is
  // leaving win over the one arriving.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    ratios.current = slides.map(() => 0);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = slides.indexOf(e.target as HTMLElement);
          if (i >= 0) ratios.current[i] = e.intersectionRatio;
        }
        let best = 0;
        for (let i = 1; i < ratios.current.length; i++) {
          if ((ratios.current[i] ?? 0) > (ratios.current[best] ?? 0)) best = i;
        }
        setActive(best);
      },
      { root: el, threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const s of slides) io.observe(s);
    return () => io.disconnect();
  }, [count]);

  const go = useCallback(
    (i: number) => {
      const el = rail.current;
      if (!el) return;
      const target = Math.min(count - 1, Math.max(0, i));
      (el.children[target] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest", inline: "start" });
    },
    [count],
  );

  const step = "inline-grid size-11 cursor-pointer place-items-center rounded-[14px] border border-line-strong bg-surface active:scale-[0.98] disabled:cursor-default disabled:opacity-40 motion-reduce:active:scale-100";

  return (
    <div role="group" aria-roledescription="carousel" aria-label={label} className="mt-12">
      {/* tabIndex so the rail is keyboard-scrollable, the same affordance FixRail gives its row. */}
      <ul
        ref={rail}
        tabIndex={0}
        className="flex snap-x snap-mandatory scroll-smooth gap-6 overflow-x-auto pb-2 motion-reduce:scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {quotes.map((q, i) => (
          <li
            key={q.name}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="w-full shrink-0 snap-start"
          >
            {/* h-full against the flex row's stretch, so every card is the height of the tallest and
                the controls below never move between slides. */}
            <figure className="flex h-full flex-col rounded-[14px] border border-line bg-surface p-6 shadow-card md:grid md:grid-cols-12 md:gap-8 md:p-8">
              {q.media ? <div className="md:col-span-5">{q.media}</div> : null}
              <div className="mt-6 flex flex-col md:col-span-7 md:mt-0">
                {q.placeholder ? (
                  <p className="mb-4 w-fit rounded-[14px] border border-dashed border-line-strong px-2.5 py-1 text-xs text-muted">
                    Placeholder, not a client quote
                  </p>
                ) : null}
                <blockquote className="font-display text-xl leading-snug font-extrabold tracking-[-0.04em] md:text-2xl">
                  &ldquo;{q.excerpt}&rdquo;
                </blockquote>
                <figcaption className="mt-auto pt-6 text-[15px]">
                  <span className="font-semibold">{q.name}</span>
                  <span className="text-muted">
                    , {q.role}, {q.org}
                  </span>
                </figcaption>
              </div>
            </figure>
          </li>
        ))}
      </ul>

      {/* One row: paging on the left, the section's link and the counter on the right. The link used
          to sit on its own line under this row, which spent a whole line of height on one link and
          left the right half of the row empty. It wraps rather than scrolls: below about 420px the
          four dots and two buttons already fill the spine, so the right group drops to a second line
          instead of pushing the row wider. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-4">
        <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous client story" className={step}>
          <CaretLeftIcon weight="bold" className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => go(active + 1)} disabled={active === count - 1} aria-label="Next client story" className={step}>
          <CaretRightIcon weight="bold" className="size-5" aria-hidden />
        </button>

        {/* The dot is small; its target is not. Each sits in a 44px box per rule 5, with the 8px the
            rule asks for between targets coming from the row's own gap. */}
        <ul className="ml-1 flex items-center">
          {quotes.map((q, i) => (
            <li key={q.name}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to client story ${i + 1}`}
                aria-current={i === active}
                className="grid size-11 cursor-pointer place-items-center"
              >
                <span className={`block h-1.5 rounded-[14px] ${i === active ? "w-6 bg-accent" : "w-1.5 bg-line-strong"}`} />
              </button>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-4 md:gap-6">
          {action}
          <p className="text-sm text-muted tabular-nums">
            {active + 1} of {count}
          </p>
        </div>
      </div>
    </div>
  );
}
