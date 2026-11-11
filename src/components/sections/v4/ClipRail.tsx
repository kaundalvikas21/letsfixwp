"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The clip wall as a real carousel below 768, and a plain row of four above it.
 *
 * **Why the controls exist, having been argued away once.** Task 81 shipped this as a snap rail with
 * no controls, on the reasoning that swipe is the control on a phone and contract rule 9's prev and
 * next are there for mouse users. The owner sent a screenshot of it on a phone: a card, and a second
 * card running off the edge, and no way to tell the thing moves. The reasoning was right about how it
 * behaves and wrong about how it reads. An affordance nobody can see is not an affordance, so the dots
 * and the arrows are here, and rule 9 is now satisfied literally rather than argued around.
 *
 * **Two classes carry the touch behaviour and are worth naming.** `overscroll-x-contain` stops a swipe
 * that reaches the last card from continuing into the page behind it, which on iOS Safari and Chrome
 * for Android is the gesture that triggers back-navigation; without it a flick past the fourth client
 * can leave the site. `touch-pan-x` tells the compositor this box takes horizontal drags, so a swipe
 * is handled without waiting to see whether a listener will cancel it, and a vertical drag still
 * scrolls the page rather than fighting the rail. Both are dropped at `md`, where there is no rail.
 *
 * **Still nothing moves on its own.** There is no autoplay and no timer, so rule 9's pause and its
 * stops on hover, focus and reduced motion are vacuous rather than missing. The only motion is the
 * scroll a press asks for, and `motion-reduce:scroll-auto` turns that into a jump: one line of CSS
 * rather than a JS branch that could drift from it.
 *
 * **The cards are rendered on the server and handed in as nodes.** Nothing from src/content/videos.ts
 * reaches this bundle, the same way ExpandingRows takes its `image`. This component knows how many
 * children it has and nothing else about them.
 *
 * Roles follow the APG carousel pattern, which `QuoteCarousel` established on this site before it was
 * deleted: a labelled `group` with `aria-roledescription="carousel"`, a real list inside it so the
 * slides keep list semantics, and an "n of m" label per slide. No live region, because nothing here
 * changes without the visitor asking for it.
 */
export function ClipRail({
  children,
  label,
  action,
  className,
}: {
  children: ReactNode[];
  label: string;
  /** The section's own link, rendered into the control row rather than stranded on a line of its own. */
  action?: ReactNode;
  className?: string;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const ratios = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const [railed, setRailed] = useState(false);
  const count = children.length;

  // Whether the controls apply at all. They are `md:hidden` in CSS, but a hidden control that still
  // answers the keyboard is a trap, so the same 768 is read here and the row is not rendered above it.
  // Kept in state rather than read during render because the server has no window and the two would
  // disagree on the first paint.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setRailed(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Which card is showing, from an observer rooted on the rail rather than a scroll listener, because
  // contract rule 6 bans window scroll listeners. The ratio per card is kept across callbacks: a
  // callback only carries the cards whose visibility just changed, so picking the best of one batch
  // would let a card that is leaving win over the one arriving.
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

  // `block: "nearest"` is load-bearing: without it, paging a horizontal rail also scrolls the page
  // vertically to centre the card it just moved to. No `behavior` argument, so the scroller's computed
  // `scroll-behavior` decides, which is what makes the reduced-motion handling one CSS class.
  const go = useCallback(
    (i: number) => {
      const el = rail.current;
      if (!el) return;
      const target = Math.min(count - 1, Math.max(0, i));
      (el.children[target] as HTMLElement | undefined)?.scrollIntoView({ block: "nearest", inline: "start" });
    },
    [count],
  );

  const step =
    "inline-grid size-11 cursor-pointer place-items-center rounded-[14px] border border-line-strong bg-surface active:scale-[0.98] disabled:cursor-default disabled:opacity-40 motion-reduce:active:scale-100";

  return (
    <div
      role={railed ? "group" : undefined}
      aria-roledescription={railed ? "carousel" : undefined}
      aria-label={railed ? label : undefined}
      className={className}
    >
      {/* `reveal-self`, not `reveal`, and this is the fix for a bug that survived four tasks.
          
          `reveal` hides each direct child at opacity 0 and animates it in when the observer sees it.
          The observer's test is `threshold: [0, 0.2]`: a child has to be a fifth visible before it is
          painted at all. That is right for a column, where everything scrolls into view eventually,
          and wrong for a horizontal rail, where the cards to the right of the fold may never cross
          the line. The peek is the whole problem: at 90/10 it was 34px of a 293px card, 11.6%, and at
          85/15 it is 52px of 275, 18.9%. Both sit under 20%, so the second card was laid out, measured
          and reported present every time, and painted at opacity 0.
          
          That is why "click next then prev" fixed it: next scrolls card two past the threshold, the
          observer fires, `once: true` keeps it at 1, and prev comes back to a card that is now
          visible. It is also why every measurement taken in Tasks 84 to 87 disagreed with what was on
          the owner's screen, since a bounding box does not care about opacity.
          
          `reveal-self` animates the rail as one element, so no card is ever individually hidden and
          the peek is painted from the first frame. `ClipGrid` keeps per child `reveal`: it is a
          column, its children do all cross the threshold, and the stagger there is correct. */}
      <ul
        ref={rail}
        // Focusable while it is a scroll container, and only then.
        //
        // Task 81 left this off, reasoning that every card holds a play button so tabbing through them
        // scrolls the rail by itself. That is true of a filled rail and false of this one: while the
        // slots are unfilmed a card is a dashed box with nothing focusable in it, so the rail becomes a
        // scrollable region a keyboard cannot reach. `axe` names it `scrollable-region-focusable`, and
        // it only showed up once the empty state was tested rather than the fixtures.
        //
        // `railed` rather than always, because above 768 this is a grid that does not scroll, and a
        // focus stop on it would be a tab that goes nowhere.
        tabIndex={railed ? 0 : undefined}
        aria-label={railed ? label : undefined}
        className="reveal-self -my-2 flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth py-2 motion-reduce:scroll-auto [scrollbar-width:none] md:my-0 md:grid md:touch-auto md:grid-cols-4 md:gap-6 md:overflow-visible md:py-0 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((card, i) => (
          <li
            key={i}
            aria-roledescription={railed ? "slide" : undefined}
            aria-label={railed ? `${i + 1} of ${count}` : undefined}
            // One card per view with a sliver of the next, and the sliver is 15% rather than the 10%
            // asked for in Task 84. The gutter is 1rem, so `calc(85% - 1rem)` makes the card plus its
            // gutter 85% and leaves the next card 15%. At 375, where the rail is 343 wide: card 275,
            // gutter 16, peek 51, against 34 at 90/10.
            //
            // **Why the ratio moved.** 10% was reported invisible three times. It was not: it rendered
            // at 34px every time it was measured. The fault is contrast, not geometry. A card that has
            // no clip in it yet is `--surface-2` on `--bg`, 28 against 12, behind a 1px border at 8%
            // white, so 34px of it on a phone is nothing to look at. With a poster in the slot the same
            // 34px is a slice of a photograph and reads immediately, which is why every filled check
            // passed. The site is unfilmed and stays that way until the clips exist, so the empty state
            // is the one that has to work. 51px gives the eye half as much again to find.
            //
            // The cap is for the gap between a large phone and the 768 switch. 85% of a 700px rail is
            // a 595px card, which at 9/16 stands over 1000px tall and is taller than the screen it is
            // on. Real phones are 320 to 430 wide and stay under the cap, so they keep the true 85/15.
            //
            // `[&>figure]:border-line-strong` is the other half of the fix and is scoped to the rail,
            // so the case study grid keeps the border it has. It lifts a card's outline from `--line`,
            // which MASTER calls decorative at 8% white, to `--line-strong` at 36%, which the same
            // table puts at 3.26:1 and reserves for a boundary that has to be seen. A clip card holds a
            // play button and is itself the control, so it qualifies. That one line is what makes the
            // edge of the next card an edge rather than a slightly different darkness.
            className="w-[calc(85%-1rem)] max-w-[400px] shrink-0 snap-start [&>figure]:border-line-strong md:w-auto md:max-w-none"
          >
            {card}
          </li>
        ))}
      </ul>

      {/* Under the rail, on one row with the section's own link: the link on the left, the paging on
          the right. Task 84 put this row above the rail because a 90% card is 488px tall and controls
          below it fall past the fold on an 812px phone. The owner has now seen both and asked for
          bottom right, so the fold is the accepted cost: this row is reached by scrolling, and the
          peek of the next card is what says the rail moves before you get there.

          The dots are gone at the owner's request. The counter carries the same two facts they did,
          which card you are on and how many there are, in about a quarter of the width; losing them is
          what lets the link, the counter and the two arrows sit on one line at 375 rather than wrapping
          to two. `flex-wrap` stays as the fallback for a longer link or a larger text size.

          The row renders whenever there is a link or a rail. Above 768 there is no rail, so on the
          home page this is just the link, exactly as it was, and on pricing the row is not rendered. */}
      {action || railed ? (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-4">
          {action}
          {railed ? (
            <div className="ml-auto flex items-center gap-2">
              <p className="text-sm text-muted tabular-nums">
                {active + 1} of {count}
              </p>

              <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous client" className={step}>
                <CaretLeftIcon weight="bold" className="size-5" aria-hidden />
              </button>
              <button type="button" onClick={() => go(active + 1)} disabled={active === count - 1} aria-label="Next client" className={step}>
                <CaretRightIcon weight="bold" className="size-5" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

    </div>
  );
}
