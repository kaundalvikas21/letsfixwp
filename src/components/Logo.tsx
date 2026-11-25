import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * The brand mark: the ember drop.
 *
 * Two shapes, one idea. In the wordmark the dot of the `i` in "Fix" is a falling ember droplet, so the
 * name reads as the fix on its way down to the site. The monogram is that droplet at icon size with a W
 * cut out of it, for the favicon, the touch icon and the 404 reveal.
 *
 * **The wordmark is live text, not a picture of text.** The name comes from `brand.name` and is split at
 * its first `i`, which is then set as the dotless `ı` (U+0131) with the drop placed above it. U+0131 is in
 * the latin subset `next/font` already loads for Bricolage Grotesque, so this costs no extra font bytes.
 * Selecting the mark and copying it yields "LetsFixWP", search engines read the name, and the drop scales
 * with the type because every number below is in `em`.
 *
 * The visual pair is `aria-hidden` with an `sr-only` copy of the name beside it. Without that, a screen
 * reader would read the name in two pieces around a letter it cannot pronounce.
 *
 * **The drop is the one ember moment in the mark.** MASTER reserves the accent for display words and link
 * roles, so the letters stay `--text` and only the drop carries ember. At footer size that would be a very
 * large area of accent, which is why `dropClass` exists: the giant wordmark dials it back to match the 36%
 * text mix the rest of the letters are set in.
 */

/** The falling droplet: pointed where it left, round where it is going. */
const DROP_D = "M12 1C12 1 21 13.2 21 21A9 9 0 1 1 3 21C3 13.2 12 1 12 1Z";

/**
 * The monogram: the same droplet, with a W knocked out of its body.
 *
 * One path and `fill-rule="evenodd"`, which matters more than it looks. The glass reveal reduces whatever
 * it is handed to alpha and builds a distance field from it, so a W drawn as a second shape in the page
 * colour would arrive as solid droplet with no letter in it. A hole is a hole at every size and in every
 * renderer.
 *
 * The W is 14 straight segments: four slanted bars, their ends cut square at the top and bottom of the
 * letter, and their edges meeting at the two upper valley corners, the flat apex and the inner apex. The
 * apex is flat because these bars are steep: carried to their true crossing it would land above the top of
 * the letter.
 */
const MONOGRAM_D =
  "M50 4C50 4 96 54 96 74A46 46 0 1 1 4 74C4 54 50 4 50 4ZM17.6 54H29.6L38.5 83.9L45.7 63.6H54.3L61.5 83.8L70.4 54H82.4L68 102H56L50 85.2L44 102H32Z";

const MONOGRAM_BOX = { w: 100, h: 120 } as const;

/** The monogram as markup, for the one consumer that needs a string rather than an element. */
export const monogramSvg = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MONOGRAM_BOX.w} ${MONOGRAM_BOX.h}"><path fill="currentColor" fill-rule="evenodd" d="${MONOGRAM_D}"/></svg>`;

export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox={`0 0 ${MONOGRAM_BOX.w} ${MONOGRAM_BOX.h}`} aria-hidden className={cn("fill-accent", className)}>
      <path fillRule="evenodd" d={MONOGRAM_D} />
    </svg>
  );
}

/**
 * The name with the drop in it. Inherits every type property from its parent, so the nav, the footer line
 * and the 16.6rem footer wordmark all mount the same component.
 *
 * `dropClass` sets the drop's fill and nothing else.
 */
export function Wordmark({ dropClass }: { dropClass?: string }) {
  const at = brand.name.indexOf("i");
  // A name with no `i` has nowhere to put the drop, so it renders as plain text rather than guessing.
  if (at === -1) return <>{brand.name}</>;

  return (
    <>
      <span aria-hidden>
        {brand.name.slice(0, at)}
        {/* An empty inline-block of zero width, which exists only to put a containing block on the
            baseline. A box with no content of its own takes its baseline from its bottom edge, so
            that edge lands on the text baseline and the `bottom` below is measured from there.
            Wrapping the letter instead measures from the bottom of the line box, and line-height is
            not the same in the nav as it is in the footer, so the drop sat differently in each. */}
        <span className="relative inline-block w-0 align-baseline">
          <svg
            viewBox="0 0 24 30"
            // Measured against the face, not guessed: a canvas pixel scan of Bricolage's own `i` at
            // 800 puts its dot between 0.575em and 0.725em above the baseline, with the dotless stem
            // ending at the 0.53em x-height. The drop starts where that dot starts and runs 0.05em
            // taller, which is the one liberty it takes, and is centred on the 0.235em advance of
            // the stem it stands over.
            className={cn("absolute bottom-[0.575em] left-[0.038em] w-[0.16em] fill-accent", dropClass)}
          >
            <path d={DROP_D} />
          </svg>
        </span>
        {"ı"}
        {brand.name.slice(at + 1)}
      </span>
      <span className="sr-only">{brand.name}</span>
    </>
  );
}
