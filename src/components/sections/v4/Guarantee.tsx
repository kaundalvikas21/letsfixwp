import Link from "next/link";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";
import { GuaranteeHeading } from "./GuaranteeHeading";

// The mask itself lives in globals.css (@utility guarantee-mask): @supports, the ember luminance
// floor and the reduced-motion fallback are all CSS, so this section needs no client island.
/**
 * The guarantee, set huge with a real photograph showing through the letters.
 *
 * The number is brand.guarantee, never the 30 days in brand.legacy.facts: that belongs to the old
 * fixmywp.com business and is not this company's promise. While brand.guarantee is a placeholder the
 * card says so on the page, and a production deploy fails until it is replaced; if the owner sets it
 * to null, the whole section renders nothing (contract rule 8).
 */
export function Guarantee() {
  const g = brand.guarantee;
  if (!g) return null;

  return (
    <section aria-labelledby="guarantee" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      {/* The masked words are the heading, not a decoration above one. This section briefly carried
          both: a 48px "Guarantee" sitting on top of a 136px "14-day guarantee", so the h2 was smaller
          than the display text it introduced and repeated its own word. The mask leaves real text in
          the DOM, so making it the h2 costs nothing in the accessibility tree. */}
      <h2 id="guarantee">
        <span className="sr-only">{g.days}-day guarantee</span>
        <GuaranteeHeading text={`${g.days}-day guarantee`} />
      </h2>

      {g.placeholder && (
        <p className="mt-6 w-fit rounded-[14px] border border-dashed border-line-strong px-3 py-2 text-sm text-muted">
          Placeholder guarantee, not a real offer. Replace before launch.
        </p>
      )}

      {/* The copy used to hug the left for 600px under a heading that ran the full width, leaving the
          right half of the section empty. Reading matter left, the way in right, on one line from md
          up, so the block sits under the heading rather than beside a void. */}
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <p className="max-w-[52ch] text-lg">
          Every fix carries a {g.days}-day guarantee. {g.summary}
        </p>
        <Link
          href={routes.legal.guarantee}
          className="inline-flex min-h-11 shrink-0 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline"
        >
          Read the guarantee
        </Link>
      </div>
    </section>
  );
}
