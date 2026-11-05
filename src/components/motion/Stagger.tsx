import { Children, cloneElement, isValidElement, type ElementType, type ReactNode } from "react";
import { stagger, staggerDelay, type Direction } from "./tokens";

/**
 * A group whose children arrive one after another, each on its own crossing of the viewport edge.
 *
 * Same engine as `Reveal` and for the same reason: a Server Component that emits a class and some
 * data attributes, with the hidden state applied by the inline script rather than by Motion, so a
 * page of body copy is never waiting on hydration to become visible. Read `Reveal`'s note for the
 * full argument.
 *
 * **Each child is its own trigger.** The wrapper is not watched; its direct children are, which
 * means a card in row three starts when row three crosses the fold rather than when the grid did.
 * The index delay then orders the children within whatever arrives together.
 *
 * **The cap is the part that earns its place.** `stagger.cap` is 6, so the 7th child and everything
 * after it share the 6th's delay. Without it the twelfth card in a grid waits 0.84s behind the
 * first, which on a row that crossed the edge together reads as a queue forming rather than as a
 * set arriving. This is the one place the site staggers at all: the element-level reveal it
 * replaces deliberately had none.
 *
 * Children must be real elements. A string or a fragment cannot carry the delay attribute, so it is
 * passed through untouched and simply arrives with the group.
 */
export function Stagger({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  distance,
  direction = "up",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  /** The element to render. Use `ul`/`ol` when the children are `li`, so the semantics survive. */
  as?: ElementType;
  /** Milliseconds added to every child's index delay, for sequencing one group behind another. */
  delay?: number;
  /** Travel in px. Unset uses the responsive token (24 desktop / 14 mobile). */
  distance?: number;
  /** Where the children travel **from**. `none` is a plain fade. */
  direction?: Direction | "none";
  /** Defaults to brief rule 2. See the note on `Reveal`. */
  once?: boolean;
}) {
  return (
    <Tag className={className ? `reveal ${className}` : "reveal"}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const own = child.props as Record<string, unknown>;
        return cloneElement(child, {
          // Milliseconds, because the script works in them; the token is in seconds like the rest
          // of the Motion-facing table. A child that sets its own direction or distance keeps it,
          // so one odd card in a grid can travel differently without leaving the group.
          "data-rv-delay": delay + Math.round(staggerDelay(i) * 1000) || undefined,
          "data-rv-dir": own["data-rv-dir"] ?? direction,
          "data-rv-dist": own["data-rv-dist"] ?? distance,
          "data-rv-repeat": once ? undefined : "",
        } as Record<string, unknown>);
      })}
    </Tag>
  );
}

/** The cap and step, exported so a caller can explain a delay without reaching into the token file. */
export const staggerTokens = stagger;
