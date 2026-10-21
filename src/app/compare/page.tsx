import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { collectionLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, h2, page, pageY } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { compares } from "@/content";
import { cn } from "@/lib/utils";

const seo = {
  title: "WordPress Comparisons",
  description: "Neutral side-by-side comparisons: WordPress or Wix, WooCommerce or Shopify, a care plan or pay-as-you-go support.",
};

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: routes.compares },
};

/**
 * /compare/. Three comparisons, and the index may not be three cards of them.
 *
 * Layout family: a stacked split ledger. Each comparison is one full-width entry whose left column
 * is the pairing itself, the two names set at equal weight with the seam and the word "vs" between
 * them, and whose right column is every criterion that comparison is built on, across a hairline.
 * The unit is therefore a split rather than a tile: three of them stack down the page as rows of
 * one list, which is why contract rule 6's "three equal cards in a row" never arises. It also
 * deliberately avoids `CompareTemplate`'s family, verdict-by-scenario cards over a real comparison
 * table: a parent rendering its child's layout with less data in it reads as a duplicated page.
 *
 * Everything on screen is read from src/content/compares/: the two names, the criterion titles, and
 * a count of the scenarios behind the link. Nothing is summarised and no side is characterised,
 * because which one fits depends on the scenario and the files decline to declare a winner.
 *
 * Three layout families, none repeated: a lead header, the split ledger, a closing band.
 */
export default function CompareIndex() {
  return (
    <div className={cn(page, pageY)}>
      <JsonLd
        data={collectionLd({
          name: seo.title,
          description: seo.description,
          path: routes.compares,
          items: compares.map((c) => ({ name: `${c.a} vs ${c.b}`, path: routes.compare(c.slug) })),
        })}
      />
      <Breadcrumbs items={nodeCrumbs(routes.compares)} />

      <header className="mt-6">
        <h1 className={h1}>Comparisons</h1>
        <p className="rise-in mt-5 max-w-[62ch] text-lg text-muted" style={{ animationDelay: "70ms" }}>
          Each one sets out where the two differ and which fits a given scenario. No winner is declared, because it depends on what you are running.
        </p>
      </header>

      {/* No `reveal` on this section, and that is measured rather than stylistic: a view-timeline
          reveal is scrubbed, so a section parked inside the first third of its range at load sits at
          part opacity, and `--muted` at part opacity is under 4.5:1. This section's heading lands a
          few hundred pixels down, which is exactly where a reader parks it. The same decision and
          the same reason are recorded for the first section of /about/. */}
      <section aria-labelledby="pairings" className="mt-16 md:mt-24">
        <h2 id="pairings" className={h2}>
          What each comparison covers
        </h2>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {compares.map((c) => (
            <li key={c.slug}>
              <Link
                href={routes.compare(c.slug)}
                className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-6 py-8 transition-colors duration-200 hover:text-accent-text md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_auto] md:gap-x-10 md:py-10"
              >
                {/* The hub rows' ember rule, replacing the row's own hairline rather than sitting
                    beside it, so nothing moves. Mouse only, or a tap would leave it lit. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-x-100"
                />

                <div className="col-start-1 row-start-1">
                  {/* One heading, read as "A vs B": the two names carry the same size and weight,
                      and the seam between them is the comparison. The word is real text rather than
                      a glyph, so the accessible name is the page's own title for the pair. */}
                  <h3 className="font-display text-[1.5rem] leading-[1.15] font-extrabold tracking-[-0.03em] [font-variation-settings:'opsz'_24]">
                    <span className="block">{c.a}</span>
                    <span className="my-2 flex items-center gap-3 text-sm font-normal tracking-normal text-muted">
                      vs
                      <span aria-hidden className="h-px flex-1 bg-line" />
                    </span>
                    <span className="block">{c.b}</span>
                  </h3>
                  <p className="mt-4 text-sm text-muted">{c.verdictByScenario.length} scenarios, each with the verdict for it.</p>
                </div>

                {/* Every criterion, named. Eight to ten short strings per comparison, so a column
                    flow rather than a list with a hairline under each row: the titles are what tells
                    a visitor whether this is their question, and they pack two abreast from sm up
                    without any of them becoming a 150px column at 375. */}
                <ul className="col-span-2 col-start-1 row-start-2 columns-1 gap-x-8 text-sm text-muted sm:columns-2 md:col-span-1 md:col-start-2 md:row-start-1 md:border-l md:border-line md:pl-10">
                  {c.rows.map((r) => (
                    <li key={r.criterion} className="mb-1.5 break-inside-avoid">
                      {r.criterion}
                    </li>
                  ))}
                </ul>

                <CaretRightIcon
                  weight="duotone"
                  className="col-start-2 row-start-1 mt-1 size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none md:col-start-3"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="compare-closing"
        className="reveal mt-20 flex flex-col gap-5 border-t border-line pt-10 md:mt-28 md:flex-row md:items-center md:justify-between md:pt-12"
      >
        <h2 id="compare-closing" className={cn(h2, "max-w-[26ch]")}>
          Want this answered for your site?
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <BookLink location="compare-index" className="btn-primary" />
          <ChatButton location="compare-index" className="btn-secondary" />
        </div>
      </section>
    </div>
  );
}
