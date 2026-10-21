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

      {/* Masthead on seven columns with the index's own measurements on the remaining five, bottomed
          on the lead's last line. The page carries no photograph (the catalogue has no honest frame
          for a decision taken before any work exists), so the second column has to be real or the
          header is two lines of type in a 1104px field. Both numbers are counted from the same
          files the ledger below reads, so they cannot drift from what the page renders, and they
          answer the question an index is actually asked: is there anything behind these three
          links. Stacked under lg, where the numbers follow the lead rather than sit beside it. */}
      <header className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className={h1}>Comparisons</h1>
          <p className="rise-in mt-5 max-w-[62ch] text-lg text-muted" style={{ animationDelay: "70ms" }}>
            Each one sets out where the two differ and which fits a given scenario. No winner is declared, because it depends on what you are running.
          </p>
        </div>
        <dl className="rise-in divide-y divide-line border-y border-line lg:col-span-5 lg:self-end" style={{ animationDelay: "140ms" }}>
          {[
            { label: "Criteria compared", value: compares.reduce((n, c) => n + c.rows.length, 0) },
            { label: "Scenarios answered", value: compares.reduce((n, c) => n + c.verdictByScenario.length, 0) },
          ].map((m) => (
            <div key={m.label} className="flex items-baseline justify-between gap-6 py-4">
              <dt className="text-muted">{m.label}</dt>
              <dd className="font-display text-[1.75rem] font-extrabold tabular-nums tracking-[-0.03em] [font-variation-settings:'opsz'_28]">{m.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* This section once had to refuse `reveal`, because its heading lands a few hundred pixels
          down, which is exactly where a reader parks it, and a scrubbed opacity ramp left whatever
          parked there under 4.5:1. `reveal-rise` is transform only now (globals.css records why),
          so a park cannot change a contrast ratio and the exception is retired here and on /about/,
          which carried the same one. Written out rather than built with `Section` only because the
          list below sets its own `mt-8`. */}
      <section aria-labelledby="pairings" className="reveal mt-16 md:mt-24">
        <h2 id="pairings" className={h2}>
          What each comparison covers
        </h2>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {compares.map((c) => (
            // The link is the heading and nothing else, stretched over the row by its own
            // `::after`. Wrapping the whole row in the anchor instead gave it an accessible name
            // computed from the entire subtree, roughly forty words to announce one destination;
            // naming it with `aria-labelledby` off the heading fixed the length and immediately
            // broke WCAG 2.5.3, because the name then no longer contained the row's own visible
            // text (axe `label-content-name-mismatch`, serious, 3 nodes, measured). One anchor
            // whose content *is* its visible label is the only shape that satisfies both: the
            // name is "WordPress vs Wix", the hit area is still the whole row, and there is still
            // one tab stop. `group` moves to the li so the rule and the caret still answer hover.
            <li
              key={c.slug}
              className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-6 py-8 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_auto] md:gap-x-10 md:py-10"
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
                  <Link
                    href={routes.compare(c.slug)}
                    className="transition-colors duration-200 group-hover:text-accent-text after:absolute after:inset-0 after:content-['']"
                  >
                    <span className="block">{c.a}</span>
                    <span className="my-2 flex items-center gap-3 text-sm font-normal tracking-normal text-muted">
                      vs
                      <span aria-hidden className="h-px flex-1 bg-line" />
                    </span>
                    <span className="block">{c.b}</span>
                  </Link>
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
