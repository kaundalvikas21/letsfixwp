"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type ErrorPanel = {
  id: string;
  /** The error in two or three words, the only thing a closed panel shows. */
  name: string;
  /** The screen itself: a real capture when one exists, otherwise the panel the project already uses. */
  screen: ReactNode;
  icon: ReactNode;
  /** The software's own words, set in mono because they are a quote, not our copy. */
  quote: string | null;
  /** True once a real capture exists: the capture already shows the words, so the panel stops setting them. */
  captured: boolean;
  /** Shown instead of the quote when the screen has no words on it at all. */
  symptom: string;
  cause: string;
};

// Shares the open panel takes against one each for the closed ones. Seven across a 1104px row leaves
// the closed panels 107px, which is a sliver that still reads as a panel. Four is the stacked figure:
// at 375 the same seven would leave closed rows 34px tall, under the 44px target the contract asks
// for, and squeeze the open one to 182px, which is too narrow to set an error message in.
const OPEN = 7;
const OPEN_STACKED = 4;

const track = (n: number, i: number, open: number) =>
  Array.from({ length: n }, (_, j) => `${j === i ? open : 1}fr`).join(" ");

/**
 * Four broken screens side by side. Click one and it opens; the rest stay as slivers, so the set
 * never stops being four things. Below md the same thing runs down the page instead of across it,
 * because a four-up row at 375 is neither a readable error message nor a 44px target.
 *
 * This replaced a pinned GSAP sticky-stack that scrolled the same four screens past the visitor one
 * at a time. The content is identical. The difference is that the visitor picks the screen that is
 * theirs instead of waiting for it, which is the point of the section, and the page gives back one of
 * its two pin budgets along with about 3000px of scroll.
 *
 * The opening runs on --ease-spring, the stiffness 100 / damping 20 spring sampled into a CSS
 * linear() in globals.css. It is the same curve the hero words and the FAQ panels settle on, so the
 * panel arrives the way everything else on this page arrives, and it is a real spring rather than a
 * bezier approximating one. The name and the line under it follow it 80ms apart, and the error's own
 * words wait 200ms, so the words land once there is room rather than reflowing the whole way out.
 *
 * Each panel is one button with aria-expanded, stretched over the whole panel, the same shape the
 * plans rows use. Focus opens a panel as well as clicking it, so tabbing through the row reveals each
 * screen in turn.
 *
 * Contract rule 10 reserves animation for transform and opacity. A panel that opens has to animate
 * its width, so this is the section's recorded exception, the same shape as the accordion-height one
 * the FAQ holds: one property, on one element, four tracks wide, rather than a growth factor on each
 * of four children.
 */
export function ErrorPanels({ panels }: { panels: ErrorPanel[] }) {
  // The critical error, not the white screen: it is the screen the rest of the page already follows
  // through the fix and the result, and it opens the section with words rather than a white slab.
  const [active, setActive] = useState(panels.length > 1 ? 1 : 0);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLUListElement>(null);
  const uid = useId();

  // The row is below the fold, so a plain mount animation would be over before anyone arrived.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul
      ref={ref}
      style={
        {
          "--rows": track(panels.length, active, OPEN_STACKED),
          "--cols": track(panels.length, active, OPEN),
        } as CSSProperties
      }
      className="mt-10 grid h-[34rem] grid-cols-1 grid-rows-[var(--rows)] gap-2 transition-[grid-template-rows,grid-template-columns] duration-[640ms] ease-[var(--ease-spring)] md:mt-12 md:h-[30rem] md:grid-cols-[var(--cols)] md:grid-rows-1 md:gap-3 motion-reduce:transition-none"
    >
      {panels.map((p, i) => {
        const open = i === active;
        const descId = `${uid}-${p.id}`;
        return (
          <li
            key={p.id}
            style={shown ? { animationDelay: `${i * 55}ms` } : undefined}
            className={[
              "relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[14px] border bg-surface-2",
              "transition-colors duration-300 ease-out",
              open ? "border-accent" : "border-line",
              // No entrance until the row is in view, and none at all under reduced motion.
              shown ? "motion-safe:animate-[rise_480ms_var(--ease-spring)_backwards]" : "opacity-0",
              "motion-reduce:opacity-100!",
            ].join(" ")}
          >
            {/* The screen fills the panel and is cropped by it, so a closed panel is a sliver of the
                same screen rather than a different thing. A sliver crops to the left edge rather than
                the middle: these screens set their words across the centre, and a 107px centre crop
                lands halfway through one, which reads as broken rather than as a glimpse. The left
                edge is the quiet part of all four. */}
            <span
              aria-hidden
              className={`absolute inset-0 [&>span]:size-full ${open ? "[&>img]:object-center" : "[&>img]:object-left"}`}
            >
              {p.screen}
            </span>

            {/* One stretched button per panel: the whole panel is the target, its accessible name is
                just the screen's name, and the words below it are content rather than part of a
                label that would read out as a paragraph. */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={descId}
              // Hover opens it on a real pointer. Click stays for touch, where pointerenter only
              // fires on the tap anyway, and focus stays for the keyboard, so tabbing the row still
              // walks through the screens.
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="absolute inset-0 z-20 cursor-pointer rounded-[14px]"
            >
              <span className="sr-only">{p.name}</span>
            </button>

            {/* What you see. No capture written yet for this one (docs/image-todo.md), so the panel
                sets the error's own words at the size the screen shows them. Never a div-built
                browser window. */}
            <span
              aria-hidden
              className={[
                "pointer-events-none relative flex min-h-0 flex-1 items-center justify-center overflow-hidden text-center font-mono text-base leading-snug text-text md:text-xl",
                "transition-opacity duration-300 ease-out motion-reduce:transition-none",
                // flex-1 and min-h-0 let this shrink, but padding does not shrink with it: 40px of it
                // plus a 68px strip does not fit the 74px a closed row gets at 375, and the strip
                // overflowed the row and cut the chip in half. Closed, it has no padding to hold.
                open ? "p-5 opacity-100 md:p-6" : "p-0 opacity-0",
                open ? "delay-200" : "",
              ].join(" ")}
            >
              {/* Once a real capture exists it is already showing the words, so the panel stops
                  setting them on top of it. */}
              {p.captured ? null : p.quote}
            </span>

            {/* Solid --bg, not a scrim. It was --scrim at 0.72, which held its text fine over any
                screen behind it, but all four graphics set their own caption across the bottom third,
                exactly where this strip sits: "White Screen of Death" and "Failed to connect to MySQL
                database" ghosted through it, beside our own name for the same screen. Opaque hides
                whatever falls behind and takes --on-photo to 17:1 rather than 7.55:1. */}
            <span
              className={[
                // p-3 stacked, not p-4, and no floor on the height there: a closed row is 74px tall
                // at 375 and a 44px chip in 32px of padding is 76, which cut the chip in half.
                // md:items-center on both states, not just the closed one: the open panel used to
                // hang its chip from the top of a 112px strip while its neighbours centred theirs in
                // the same 112px, so the four marks sat on two different lines across the row.
                "pointer-events-none relative flex shrink-0 items-start gap-3 bg-bg p-3 md:items-center md:p-4",
                open ? "md:min-h-28" : "md:min-h-28 md:justify-center md:px-2",
              ].join(" ")}
            >
              {/* The same chip whichever state the panel is in, centred when the panel is a sliver
                  and the mark is all it has room to say. 14px, not the reference's circle: the
                  MASTER's shape lock is one radius for every chip, card and frame on the site. */}
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-line-strong bg-scrim text-accent-text shadow-card backdrop-blur-[10px]"
              >
                {p.icon}
              </span>

              {/* Collapsed at md the words have nowhere to go, so the span is taken out of the flow
                  rather than left in the track at zero width: a zero-width box still wraps its text
                  one character per line, and that grew the strip on the white-screen panel from
                  112px to 432px of scrim over what is supposed to be a blank white screen. Absolute
                  also means it is not a flex item, so neither it nor the gap after it holds the chip
                  off the middle of the sliver. */}
              <span
                className={
                  open ? "min-w-0 flex-1" : "min-w-0 flex-1 md:absolute md:w-0 md:overflow-hidden"
                }
              >
                {/* Each line has its own clip box and travels its full height, so it comes up from
                    under the edge of the strip instead of appearing on the spot. translate-y-full is
                    the line's own height, whatever the type is doing at that breakpoint. */}
                <span aria-hidden className="block overflow-hidden">
                  <span
                    className={[
                      "block font-display text-lg leading-tight font-extrabold tracking-[-0.03em] whitespace-nowrap text-on-photo md:text-2xl",
                      // Two or three words that never wrap, so no opening width can drag this one
                      // through a re-flow on its way in.
                      "transition-[opacity,translate] delay-[420ms] duration-[420ms] ease-[var(--ease-spring)] motion-reduce:transition-none motion-reduce:delay-0",
                      open ? "translate-y-0 opacity-100" : "md:translate-y-full md:opacity-0",
                    ].join(" ")}
                  >
                    {p.name}
                  </span>
                </span>
                {/* What it usually means, in the frame and under the name rather than in a strip
                    below the row. It is the guide's own most likely cause, so this section cannot
                    drift from the guide it sends people to. */}
                <span id={descId} className={open ? "mt-1.5 block overflow-hidden" : "mt-1.5 hidden overflow-hidden md:block"}>
                  <span
                    className={[
                      "block text-[15px] leading-relaxed text-on-photo",
                      // A wrapping sentence, and while the panel is widening it re-wraps on every
                      // frame, which is what read as jerky. Its delay is the width's own duration to
                      // the millisecond, so it never starts while the box it wraps into is still
                      // changing size. The name goes first because it cannot re-wrap at all, which
                      // is what makes the two read as one move rather than a wait.
                      "transition-[opacity,translate] delay-[640ms] duration-[420ms] ease-[var(--ease-spring)] motion-reduce:transition-none motion-reduce:delay-0",
                      open ? "translate-y-0 opacity-100" : "md:translate-y-full md:opacity-0",
                    ].join(" ")}
                  >
                    {p.quote ? p.cause : `${p.symptom}. ${p.cause}`}
                  </span>
                </span>
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
