import type { ElementType } from "react";
import { staggerDelay } from "./tokens";

/**
 * A headline arriving a line or a word at a time, out from behind its own clip edge.
 *
 * **Headlines only, and never the LCP element.** Brief rule 4 keeps the first viewport static, and
 * on every inner route of this site the `h1` is the largest paint: an element at `opacity: 0` is
 * not painted at all, so fading one in holds LCP back by the length of the animation. Use this on a
 * closing line or a section headline below the fold. The primitive cannot check this for you.
 *
 * **It is a Server Component, like `Reveal` and `Stagger`, and for the same reason.** It was built
 * on Motion's `whileInView` first, and the measurement that sent it back was the one this project
 * keeps relearning: with JS off, the home page's closing headline shipped as `opacity: 0` and the
 * last thing the page said was invisible. The ledger already records `MaskRise` and `CtaReveal`
 * failing exactly this way. So the clip rise runs on the same inline-script engine, which applies
 * the hidden state only once code the HTML parser has already run says so.
 *
 * **The box is observed; the line inside it is what moves.** That split is not tidiness. A line at
 * `translateY(100%)` inside an `overflow-hidden` parent is entirely clipped, and an
 * `IntersectionObserver` measures what is left after an ancestor clips it, which is nothing: put
 * the trigger on the inner span and its ratio is zero for as long as it is hidden, so it is never
 * told to appear and the line never shows up. `data-rv-target="child"` is what tells the engine to
 * watch this element and animate the one inside it, and the stylesheet hides the child rather than
 * the box for the same reason. This is the trap `MaskRise` recorded and it is easy to reintroduce.
 *
 * `split="word"` gives each word its own clip box and its own delay off the shared 70ms ladder.
 * Pass a plain string, not markup. The accessible name is unaffected: the words are real text nodes
 * in order inside `inline-block` spans that carry no roles.
 */
export function TextReveal({
  children,
  className,
  as: Tag = "span",
  split = "line",
  delay = 0,
  once = true,
  distance,
  direction,
}: {
  children: string;
  className?: string;
  as?: ElementType;
  /** `line` treats the whole string as one unit. `word` gives each word its own box and delay. */
  split?: "line" | "word";
  /** Milliseconds before the first unit starts. */
  delay?: number;
  once?: boolean;
  /** Accepted for API symmetry; the travel here is the type's own height. Ignored. */
  distance?: number;
  /** Accepted for API symmetry; this always rises from behind its edge. Ignored. */
  direction?: string;
}) {
  void distance;
  void direction;
  const units = split === "word" ? children.split(/\s+/).filter(Boolean) : [children];
  return (
    <Tag className={className}>
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          data-rv-target="child"
          data-rv-dir="clip"
          data-rv-delay={delay + Math.round(staggerDelay(i) * 1000) || undefined}
          data-rv-repeat={once ? undefined : ""}
          // 0.16em of descender room below the baseline, pulled back with a negative margin, so a
          // `g` or a `y` is never shaved off at rest. Without it the clip edge cuts the typeface.
          className={`inline-block overflow-hidden pb-[0.16em] -mb-[0.16em] align-bottom${split === "word" ? " mr-[0.25em]" : ""}`}
        >
          <span className="block">{unit}</span>
        </span>
      ))}
    </Tag>
  );
}
