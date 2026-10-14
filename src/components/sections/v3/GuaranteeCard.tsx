import Link from "next/link";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";

/**
 * v3 home: centred manifesto card, the guarantee is the design. Renders nothing until the owner sets
 * brand.guarantee (contract rule 8): the guarantee in legacyFacts belongs to the old business, not LetsFixWP.
 * No CTA here on purpose, to keep CTA density sane.
 */
export function GuaranteeCard() {
  const g = brand.guarantee;
  if (!g) return null;
  return (
    <section aria-labelledby="guarantee" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <div className="mx-auto max-w-4xl rounded-[20px] border border-line bg-surface px-6 py-14 text-center shadow-card md:px-16 md:py-20">
        {g.placeholder && (
          <p className="mx-auto mb-6 max-w-md rounded-[12px] border border-dashed border-line-strong px-3 py-2 text-sm text-muted">
          Placeholder guarantee, not a real offer. Replace before launch.
        </p>
        )}
        <p aria-hidden className="font-display text-[7rem] leading-none font-extrabold tracking-[-0.04em] text-accent-text md:text-[10rem]">
          {g.days}
        </p>
        <h2 id="guarantee" className="mt-4 font-display text-3xl leading-tight font-extrabold tracking-[-0.02em] md:text-4xl">
          <span className="sr-only">{g.days} </span>
          {g.days === 1 ? "day" : "days"} of guarantee on every fix
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-lg text-muted">{g.summary}</p>
        <Link href={routes.legal.guarantee} className="mt-8 inline-flex min-h-11 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
          Read the guarantee
        </Link>
      </div>
    </section>
  );
}
