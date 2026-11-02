import type { ReactNode } from "react";
import { Stagger } from "@/components/motion";

// The row grid lives here rather than in the section, because this component owns the <li>. The
// section owns what goes inside one.
const ROW =
  "practice-row group relative isolate grid grid-cols-[2rem_1.25rem_minmax(0,1fr)] gap-x-3 gap-y-1.5 border-b border-line py-5 md:grid-cols-[3.25rem_1.25rem_minmax(0,17rem)_minmax(0,1fr)] md:items-start md:gap-x-6 md:py-7";

/**
 * The five practices arrive one after another as the section comes into view, and the row under the
 * pointer lights its own hairline.
 *
 * What the arrival communicates: these are five separate promises, not one paragraph of reassurance.
 * Read in sequence they land as a list of commitments; arriving together they would read as a block
 * of text to skip. Once only, and only on the way down: a trust list that replays every time the
 * section crosses the fold would be decoration.
 *
 * The hover is the ember rail from the fix scene, one row wide, and behind it a panel that wipes in
 * from the left. Both travel left to right, which is the reading direction, and together they say
 * "this line" without claiming the row is a link, which it is not (DESIGN.md's Hover Earns It Rule).
 * Tailwind v4 already gates every hover: variant behind (hover: hover), so a tap on a phone does not
 * fire it.
 *
 * The wipe is ported from shopdev.studio's capability rows, which is where the owner saw it, with
 * three changes the variation requires. Theirs fills with a gradient in the brand colour; gradients
 * are banned here outside the hero scrim, and an ember fill under a row would read as a selected
 * state, so this one is flat `--surface`, one step up from the page, which is a reading highlight
 * rather than a claim. Theirs also rotates an arrow and fills a large outlined numeral: the arrow
 * belongs to links and these rows are not links, and numbered rows are a step label, which contract
 * rule 6 bans. What is left is the move itself, which is the part that is good.
 *
 * **This is a Server Component now.** Its only use of Motion was the stagger, and `Stagger` does
 * that through the stylesheet rather than through hydration, so the client island this file used to
 * be is gone: no `"use client"`, no bundle, and the five rows are in the HTML at full opacity if
 * the script never arrives. The hover wipe, the ember rail and the hollow index were always pure
 * CSS and are untouched. The ladder moved from its own 55ms to the token table's 70ms.
 */
export function PracticeRows({ children }: { children: ReactNode[] }) {
  return (
    <Stagger as="ul" className="mt-10 border-t border-line md:mt-12">
      {children.map((child, i) => (
        <li key={i} className={ROW}>
          {/* The index, ported from the reference's capability rows: a large hollow figure that
              fills with ember as the pointer crosses the row.

              `aria-hidden`, and the list stays a `<ul>`. These five are promises, not steps, and
              nothing about them runs in an order: a screen reader announcing "zero one, vetted
              engineers" would assert a sequence the page does not have and the contract bans
              (rule 6, no step labels). Sighted readers get it as what it is on the reference too,
              a typographic index that gives the row an anchor on the left. Decoration that counts
              is still decoration.

              Tabular figures, so 01 through 05 all occupy the same width and the icons beside them
              stay on one vertical line. */}
          <span aria-hidden className="practice-index self-start font-display text-[1.75rem] font-extrabold tracking-[-0.04em] md:text-[2.25rem]">
            {String(i + 1).padStart(2, "0")}
          </span>
          {child}
          {/* The wipe, behind everything in the row: `-z-10` against the row's own `isolate`, so it
              cannot paint over the words. Transform only, which is all contract rule 10 allows.

              `scale-x` from the left rather than the reference's `translateX(-102%)`, and for a flat
              fill the two are the same picture: either way a solid edge crosses the row left to
              right. What scale avoids is the panel's resting position. Translated fully left it sits
              in the gutter beside the row, where it would need `overflow-hidden` to stay hidden, and
              that would clip the ember rail below, which is deliberately a pixel outside the box.
              At `scale-x-0` there is nothing to hide.

              `-inset-x-3` bleeds the fill 12px past the text on each side so the highlight has an
              edge rather than stopping on the first letter. The row itself keeps no horizontal
              padding, because the words have to stay on the page's one left edge.

              650ms is the reference's own figure and it is the slowest thing on the page on purpose:
              the row fills under the pointer rather than snapping, which is what makes it read as
              attention rather than as a click.

              No `motion-reduce:scale-100!` on either of these, which the cancel idiom elsewhere in
              this folder might suggest. There it cancels a hover that scales something UP from its
              resting 100. Here the resting state is `scale-x-0` and the hover is the 100, so forcing
              100 would pin every row permanently highlighted. Reduced motion drops the transition
              and keeps the hover, which is a state change arriving instantly rather than a movement. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-3 inset-y-0 -z-10 origin-left scale-x-0 bg-surface transition-[scale] duration-[650ms] ease-[var(--motion-ease)] group-hover:scale-x-100 motion-reduce:transition-none"
          />
          {/* Sits exactly on the row's own hairline rather than beside it, so the ember replaces the
              line instead of thickening the row by a pixel.

              `transition-[scale]`, not `transition-transform`: `scale-x-0` is written to the
              standalone `scale` property on Tailwind v4, so naming `transform` transitioned nothing
              and this rail had been snapping its full width since it shipped. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-[scale] duration-[260ms] ease-[var(--motion-ease)] group-hover:scale-x-100 motion-reduce:transition-none"
          />
        </li>
      ))}
    </Stagger>
  );
}
