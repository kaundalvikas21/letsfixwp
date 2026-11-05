import type { ElementType, ReactNode } from "react";
import { distance as distanceTokens, type Direction } from "./tokens";

/**
 * A single element fading and travelling into place the first time it crosses the viewport edge.
 *
 * **This is not a Motion component, and that is deliberate.** `Reveal` and `Stagger` are the two
 * primitives that wrap body copy, and between them they cover every one of the site's 99 routes.
 * Motion's `whileInView` writes `opacity: 0` into the server HTML and waits for hydration to clear
 * it, so a blocked bundle, a slow network or a thrown module leaves the page blank. The brief's own
 * rule 9 asks for content that is readable with JS disabled, and rule 7 forbids patching a flash
 * with a mounted-state boolean, which together rule `whileInView` out for this job.
 *
 * So the hidden state is applied by the inline script in `app/layout.tsx`, which is the first child
 * of `<body>` and therefore code the HTML parser has already run. No script, no `.reveal-js` class,
 * no hidden state: the page renders complete and unanimated. That is the behaviour `docs/layout-ledger.md`
 * records under "The start state is applied by a script that cannot fail to arrive".
 *
 * Three consequences worth knowing:
 *
 * - **It is a Server Component.** Wrapping a section in `Reveal` does not make that section a client
 *   component and ships no JavaScript of its own (brief rule 6).
 * - **It emits a class and some data attributes, nothing else.** The script reads them; it never
 *   writes to anything React rendered, which is what keeps hydration clean (rule 7).
 * - **Zero CLS.** The element occupies its final box from the first paint. Only `opacity` and
 *   `transform` ever change (rule 1, rule 5).
 *
 * One animated element per ancestor chain. If a parent carries `Stagger`, its children must not
 * carry `Reveal`: two animations on one chain multiply their opacities and sum their translates.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  duration,
  distance,
  direction = "up",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  /** The element to render. Defaults to `div`; pass `li`, `section`, `p` and so on to keep semantics. */
  as?: ElementType;
  /** Milliseconds to hold before starting, once the element is in view. */
  delay?: number;
  /**
   * Milliseconds the entrance takes, overriding `--motion-duration` for this one element.
   *
   * Only reach for it when the travel is unusual. The token is tuned for the 24px nudge almost
   * everything uses; something rising its own height covers far more ground in the same time and
   * lurches. Longer travel, longer duration.
   */
  duration?: number;
  /**
   * Travel in px. Leave unset for the responsive token (24 desktop / 14 mobile, from
   * `--motion-distance`), which is what almost everything should use.
   */
  distance?: number;
  /**
   * Where the element travels **from**. `none` is a plain fade.
   *
   * `clip` is the one that behaves differently: the element rises out from behind its own bottom
   * edge, starting at `translateY(100%)`, which needs an ancestor that clips. Give the `Reveal`
   * itself `overflow-hidden` and a single element child; the engine then watches this box and
   * animates the child inside it. That split is not tidiness. A child sitting at `translateY(100%)`
   * inside an `overflow-hidden` parent is entirely clipped, and an `IntersectionObserver` measures
   * what is left after an ancestor clips it, which is nothing: watch the child and its ratio is
   * zero for as long as it is hidden, so it is never told to appear. `MaskRise` recorded this trap
   * and `TextReveal` nearly reintroduced it.
   */
  direction?: Direction | "none" | "clip";
  /**
   * Brief rule 2 is `once: true` everywhere and this defaults to it. `false` re-arms the element
   * when it leaves the viewport, which is an escape hatch rather than an option: a reveal that
   * replays on the way back up is the thing the rule exists to prevent.
   */
  once?: boolean;
}) {
  // A clip reveal marks the box as the thing to watch and the child as the thing to move, so it
  // must not also carry `reveal-self`: that would hide the box the observer needs to see, and the
  // engine would animate the child of an element that never becomes visible.
  const clip = direction === "clip";
  return (
    <Tag
      className={clip ? className : className ? `reveal-self ${className}` : "reveal-self"}
      data-rv-target={clip ? "child" : undefined}
      data-rv-dir={direction}
      data-rv-dist={distance}
      data-rv-dur={duration}
      data-rv-delay={delay || undefined}
      data-rv-repeat={once ? undefined : ""}
    >
      {children}
    </Tag>
  );
}

/** The default travel, exported so a caller can reason about it without reaching into the token file. */
export const defaultDistance = distanceTokens;
