import Link from "next/link";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";

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
      <h2 id="guarantee" className="text-sm font-semibold tracking-[0.02em] text-muted">
        Guarantee
      </h2>

      {g.placeholder && (
        <p className="mt-4 w-fit rounded-[14px] border border-dashed border-line-strong px-3 py-2 text-sm text-muted">
          Placeholder guarantee, not a real offer. Replace before launch.
        </p>
      )}

      {/* Decorative: the same words are below as plain text, so this is not announced twice. */}
      <p
        aria-hidden
        className="guarantee-mask mt-6 font-display text-[3rem] leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-[6rem] lg:text-[8.5rem]"
      >
        {g.days}-day guarantee
      </p>

      <p className="mt-8 max-w-[52ch] text-lg">
        Every fix carries a {g.days}-day guarantee. {g.summary}
      </p>

      <Link
        href={routes.legal.guarantee}
        className="mt-6 inline-flex min-h-11 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline"
      >
        Read the guarantee
      </Link>
    </section>
  );
}
