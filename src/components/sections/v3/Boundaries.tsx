import { boundaries } from "@/content/notices";

/**
 * v3 home: definition grid, four term and description pairs, 2x2 from md, one column below, no icons.
 *
 * A native `dl` rather than a list of divs, because every item here is a term and its definition, and the rule
 * above each term is what keeps this visibly a different family from the grouped icon list in Security, which is
 * the section directly above it. Renders nothing when brand.boundaries is off: `boundaries` is empty then, and a
 * heading with no list under it would read as a missing section rather than an absent one.
 */
export function Boundaries() {
  if (boundaries.length === 0) return null;

  return (
    <section aria-labelledby="boundaries" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <h2 data-reveal id="boundaries" className="max-w-[20ch] font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        What we don&rsquo;t do
      </h2>
      <p data-reveal className="mt-5 max-w-[56ch] text-lg text-muted">
        We fix and build WordPress sites. These four jobs sit outside that, and we tell you before you book.
      </p>
      <dl className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-2 md:gap-y-10">
        {boundaries.map((b) => (
          <div key={b.term} data-reveal className="border-t border-line pt-5">
            <dt className="font-display text-xl font-bold">{b.term}</dt>
            <dd className="mt-2 max-w-[48ch] text-muted">{b.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
