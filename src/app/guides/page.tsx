import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { Finder, type FinderLabels } from "@/components/Finder";
import { collectionLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, h2, page, pageY } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { guides, guidesFor, matchIndex, services } from "@/content";
import { cn } from "@/lib/utils";

const seo = {
  title: "WordPress Error Guides",
  description: "Plain guides to specific WordPress errors: what you see, what causes it, what is safe to try, and when to call an engineer.",
};

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: routes.guides },
};

/** Built once on the server: the finder only needs a title and a destination per candidate. */
const finderLabels: FinderLabels = {
  services: Object.fromEntries(services.map((s) => [s.id, { title: s.title, path: s.path }])),
  guides: Object.fromEntries(guides.map((g) => [g.slug, g.title])),
};

/**
 * /guides/. The entry point to all 37 guides, and the page a visitor reaches with one error in mind.
 *
 * It used to be seventeen near-identical sections, one per parent service with guides, each a 32px
 * heading over one to four 14px chips and the sentence "How we fix these: <service>" in ember
 * underline. 5,711px at 1440, inverted hierarchy throughout, and seventeen repetitions of a link
 * that only had to appear once per service. The restructure gives the page two ways in and one
 * closing beat instead:
 *
 *   1. Search, for a visitor who can describe the symptom but not name it (`Finder`).
 *   2. One directory, every one of the 37 guides grouped under the service that fixes it, in a
 *      column flow rather than seventeen stacked sections, with the literal error string on the row
 *      for the 20 guides that have one. The service title is now itself the link, which keeps all
 *      seventeen internal links and loses seventeen repetitions of a sentence.
 *
 * Three layout families, none repeated: a lead-and-instrument header, a grouped column-flow index,
 * and a closing band. The directory is plain server-rendered anchors, so all 37 guide URLs are in
 * the HTML with no interaction and no JS in the way.
 */
export default function GuidesIndex() {
  // 17 of the 32 services have at least one guide. SITEMAP order, which already runs them hub by
  // hub: the eleven under Fixes, then the three under Security, then the two under Speed and
  // migration, then WooCommerce. Nothing is sorted here, and `urgency` is deliberately not printed
  // on a row: the hub pages record why.
  const groups = services.map((s) => ({ s, gs: guidesFor(s.id) })).filter((x) => x.gs.length);

  return (
    <div className={cn(page, pageY)}>
      <JsonLd
        data={collectionLd({
          name: seo.title,
          description: seo.description,
          path: routes.guides,
          items: guides.map((g) => ({ name: g.title, path: routes.guide(g.slug) })),
        })}
      />
      <Breadcrumbs items={nodeCrumbs(routes.guides)} />

      {/* Headline and lead on the left seven columns, the search control on the right five. The h1
          paints at once, because it is the LCP element and an element at opacity 0 is not painted;
          the lead and then the control rise under it, 70ms apart, which is the order the page is
          read in. Stacked, the control follows the lead and nothing moves sideways. */}
      <header className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className={h1}>Knowledge Base</h1>
          <p className="rise-in mt-5 max-w-[60ch] text-lg text-muted" style={{ animationDelay: "70ms" }}>
            Every error we have written up, {guides.length} of them. Find the exact message you are seeing and what is safe to try.
          </p>
        </div>
        <div className="rise-in lg:col-span-5" style={{ animationDelay: "140ms" }}>
          <Finder index={matchIndex} labels={finderLabels} location="guides-index" />
        </div>
      </header>

      {/* One directory, not seventeen sections. A column flow rather than a grid, so the seventeen
          groups pack by their own height and none is stranded beside a hole; `break-inside-avoid`
          keeps a service and its guides together, and the flow is column-major, so tab order and
          reading order are the same. No borders and no surfaces on the groups: three bordered boxes
          in a row would be three equal cards, and the hairline rule down each group's left edge
          already says where a group starts and ends.

          The error string lives on the row rather than in a section of its own. An earlier version
          of this page gave the twenty quoted strings their own two-column list above the index, and
          it read well, but it put twenty of the thirty-seven guides on the page twice and cost
          1,712px at 375 for links that were already below it. Mono is reserved on this site for
          error strings, HTTP codes and file paths, so printing the literal line under the title is
          the one place that reservation pays: the titles are phrased for search ("WordPress 502 bad
          gateway") and the strings are what is actually on the visitor's screen ("502 Bad Gateway"). */}
      <section aria-labelledby="index" className="reveal mt-16 md:mt-24">
        <h2 id="index" className={h2}>
          Every error, grouped by what fixes it
        </h2>
        <p className="mt-3 max-w-[62ch] text-muted">
          Where a guide quotes the line WordPress prints, it is under the title, word for word.
        </p>
        <div className="mt-8 columns-1 gap-x-10 md:columns-2 lg:columns-3 lg:gap-x-12">
          {groups.map(({ s, gs }) => (
            <div key={s.id} className="mb-8 break-inside-avoid">
              {/* The service title is the link. It used to be a 14px sentence under the chips
                  reading "How we fix these: <service>", in ember underline, seventeen times. */}
              <h3 className="font-display text-lg font-bold [font-variation-settings:'opsz'_18]">
                <Link href={s.path} className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-accent-text">
                  {s.title}
                </Link>
              </h3>
              <ul className="mt-1 border-l border-line pl-4">
                {gs.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={routes.guide(g.slug)}
                      className="flex min-h-11 flex-col justify-center gap-0.5 py-1.5 text-[15px] transition-colors duration-200 hover:text-accent-text"
                    >
                      <span>{g.title}</span>
                      {/* No `block` beside `line-clamp-2`: both set `display` and the plain utility
                          wins over the clamp's -webkit-box, which silently turns the clamp off.
                          Long strings wrap rather than scroll, so a 90-character line cannot create
                          a scrollable region with no tab stop. */}
                      {g.errorText && (
                        <span className="line-clamp-2 font-mono text-sm leading-snug text-muted [overflow-wrap:anywhere]">{g.errorText}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="guides-closing"
        className="reveal mt-20 flex flex-col gap-5 border-t border-line pt-10 md:mt-28 md:flex-row md:items-center md:justify-between md:pt-12"
      >
        <h2 id="guides-closing" className={cn(h2, "max-w-[24ch]")}>
          Cannot see your error here?
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <BookLink location="guides-index" className="btn-primary" />
          <ChatButton location="guides-index" className="btn-secondary" />
        </div>
      </section>
      <p className="mt-5 text-sm text-muted">
        Nothing down right now? <CheckLink location="guides-index" />
      </p>
    </div>
  );
}
