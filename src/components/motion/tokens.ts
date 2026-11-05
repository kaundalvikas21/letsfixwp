/**
 * The motion token table. Every animated value on the site resolves to something in this file.
 *
 * These are the owner's values, set in the site-wide scroll animation brief and chosen over the
 * ones `design-system/letsfixwp-v4/MASTER.md` carried (a sampled spring at stiffness 100 /
 * damping 20, a 70ms beat and a 14px travel). MASTER.md's Motion table was rewritten to match this
 * file rather than the other way round, so there is one source and not two.
 *
 * **CSS has to carry the same numbers**, because the two primitives that wrap body copy are Server
 * Components and animate through the stylesheet, not through Motion (see `Reveal`). The custom
 * properties in `src/app/globals.css` under "Motion tokens" mirror this table, and
 * `scripts/check-motion-tokens.ts` fails the build if the two drift apart. Edit this file, then run
 * `npm run check:motion` and it will tell you exactly which CSS declaration is now stale.
 */

/** The cubic-bezier every animation on the site uses. One curve, so nothing reads as foreign. */
export const easing = [0.22, 1, 0.36, 1] as const;

/** The same curve as a CSS value, for the stylesheet and for the Web Animations API. */
export const easingCss = `cubic-bezier(${easing.join(", ")})`;

/**
 * Travel distance for an entrance, in px.
 *
 * `mobile` is not a smaller version of the same idea: on a 375px window a 24px rise is a much larger
 * share of the viewport than it is on a desktop one, and the same number would read as a lurch.
 * Rule 10 of the brief: mobile gets reduced distance. The breakpoint is `md` (768px), the same one
 * `Parallax` switches itself off at.
 */
export const distance = { desktop: 24, mobile: 14 } as const;

/** Breakpoint below which motion is reduced in amount (not switched off). Matches Tailwind `md`. */
export const mobileBreakpoint = 768;

/**
 * Durations, in seconds.
 *
 * `standard` is any entrance. `smallUi` is a control answering a pointer or a key. `countUp` is
 * deliberately the longest thing on the site: a numeral counting is the one animation whose whole
 * job is to be watched, and under about a second it reads as a glitch rather than as a count.
 */
export const duration = { standard: 0.5, smallUi: 0.35, countUp: 1.2 } as const;

/**
 * Stagger between siblings, in seconds, and the index at which the ladder stops.
 *
 * The cap is the part that matters. Without it the twelfth card in a grid waits 0.84s after the
 * first, which on a row that crossed the viewport edge together reads as a queue rather than as an
 * arrival. From the 7th child on, everything shares the 6th's delay.
 */
export const stagger = { step: 0.07, cap: 6 } as const;

/** Delay for the nth child (0-indexed), in seconds, with the cap applied. */
export const staggerDelay = (index: number) => Math.min(index, stagger.cap - 1) * stagger.step;

/**
 * When an element counts as "in view".
 *
 * `amount: 0.2` fires once a fifth of the element has crossed; the negative bottom margin holds the
 * trigger 15% up from the viewport's bottom edge so an element starts moving a beat after it
 * appears rather than at the instant it clips the fold. `once` is true everywhere (brief rule 2):
 * nothing on this site replays when you scroll back up.
 */
export const viewport = { once: true, amount: 0.2, margin: "0px 0px -15% 0px" } as const;

/** `viewport.margin` in the form `IntersectionObserver` wants (it calls the same thing rootMargin). */
export const rootMargin = viewport.margin;

/** Marquee loop length in seconds. Linear, because a loop that eases is a loop you can see restart. */
export const marqueeSeconds = 40;

/** Scroll depth, 0 to 1, at which `StickyCTA` arrives. */
export const stickyCtaThreshold = 0.6;

/** Scroll distance in px after which the header condenses. */
export const headerCondenseAt = 80;

/** Every direction an entrance can travel from, and the axis and sign each one implies. */
export const directions = {
  up: { axis: "Y", sign: 1 },
  down: { axis: "Y", sign: -1 },
  left: { axis: "X", sign: 1 },
  right: { axis: "X", sign: -1 },
} as const;

export type Direction = keyof typeof directions;

/**
 * The transform an entrance starts from, as a CSS string.
 *
 * `direction` names where the element travels **from**, which is the way a reader describes it:
 * `direction="up"` rises into place from below. Returns `none` for a plain fade.
 */
export const offsetTransform = (direction: Direction | "none", px: number) =>
  direction === "none" ? "none" : `translate${directions[direction].axis}(${directions[direction].sign * px}px)`;
