import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { Finder, type FinderLabels } from "@/components/Finder";
import { collectionLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, ClosingBand, h1, h2, page, pageY } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { guides, guidesFor, matchIndex, services } from "@/content";
import { hubIcon } from "@/content/icons";
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
 * underline. 5,711px at 1440, inverted hierarchy throughout. That restructure (Task 2) cut it to
 * two ways in and one closing beat, and the structure below is still that: search, then one
 * directory of every guide grouped under the service that fixes it.
 *
 * What Task 32 changed is that the directory was unreadable *as a directory*. 54 links in one grey
 * field at three sizes within 4px of each other, no boundary around a group, and a single
 * `hover:text-accent-text` as the only answer the pointer ever got. Three things fixed it, and all
 * three are about telling the eye where a group starts and stops:
 *
 *   1. Each group is a card. The Task 2 entry refused borders here, on the grounds that three
 *      bordered boxes in a row is three equal cards (rule 6). That holds for a feature trio and
 *      does not hold for a seventeen-item masonry directory of one to four rows each: the shapes
 *      are all different heights and the border is doing the one job a border is for, which is
 *      saying where a group ends. Logged as a deliberate reversal in the ledger.
 *   2. Each group carries its hub's mark, keyed off `service.hub`, never picked per string. Eleven
 *      of the seventeen are under Fixes, so eleven wrenches cluster the half of the page that is
 *      one subject, and the eye finds Security and WooCommerce without reading a word.
 *   3. Every row is a row: its own segment of the left rail, which turns ember under the pointer,
 *      and a trailing arrow that nudges in. The rail is built out of the rows rather than drawn
 *      down the list, which is what lets one row light up on its own.
 *
 * The header gains the instrument it was missing a container for, and the measure that says whether
 * there is anything behind the page, counted from the same files the directory reads.
 */
export default function GuidesIndex() {
  // 17 of the 32 services have at least one guide. SITEMAP order, which already runs them hub by
  // hub: the eleven under Fixes, then the three under Security, then the two under Speed and
  // migration, then WooCommerce. Nothing is sorted here, and `urgency` is deliberately not printed
  // on a row: the hub pages record why.
  const groups = services.map((s) => ({ s, gs: guidesFor(s.id) })).filter((x) => x.gs.length);

  // Rule 8: counted from src/content at build, so none of the three can drift from what renders.
  const measures = [
    { label: "Errors written up", value: guides.length },
    { label: "Services that fix them", value: groups.length },
    { label: "Messages quoted exactly", value: guides.filter((g) => g.errorText).length },
  ];

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
          the lead, then the control, then the measure rise under it, 70ms apart, which is the order
          the page is read in. Stacked, each follows the one above and nothing moves sideways.

          The control sits in a card now rather than floating in the column. It is the one thing on
          this page a visitor is meant to use, and a bare label over a bare input in an empty five
          column well read as a leftover rather than an instrument. */}
      <header className="mt-6 lg:mt-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className={h1}>Knowledge Base</h1>
            <p className="rise-in mt-5 max-w-[58ch] text-lg text-muted" style={{ animationDelay: "70ms" }}>
              Every error we have written up. Find the message on your screen and what is safe to try.
            </p>
          </div>
          <div className="rise-in lg:col-span-5" style={{ animationDelay: "140ms" }}>
            <div className="rounded-[14px] border border-line bg-surface p-5 shadow-card">
              <Finder index={matchIndex} labels={finderLabels} location="guides-index" />
            </div>
          </div>
        </div>

        {/* The /compare/ header's measure, at three cells instead of two. No border and no surface
            on a cell: a bordered three-up is the shape rule 6 names, and a hairline above the row
            with the cells divided on it says the same thing without becoming cards. */}
        <dl
          className="rise-in mt-12 grid border-t border-line sm:grid-cols-3 sm:divide-x sm:divide-line"
          style={{ animationDelay: "210ms" }}
        >
          {measures.map((m) => (
            <div key={m.label} className="flex items-baseline justify-between gap-4 border-b border-line py-4 sm:block sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:pr-0">
              <dt className="text-sm text-muted sm:order-2 sm:mt-1">{m.label}</dt>
              <dd className="font-display text-[1.75rem] font-extrabold tabular-nums tracking-[-0.03em] [font-variation-settings:'opsz'_28] sm:order-1">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* One directory, not seventeen sections. A column flow rather than a grid, so the seventeen
          groups pack by their own height and none is stranded beside a hole; `break-inside-avoid`
          keeps a service and its guides together, and the flow is column-major, so tab order and
          reading order are the same.

          The error string lives on the row rather than in a section of its own. An earlier version
          of this page gave the twenty quoted strings their own two-column list above the index, and
          it read well, but it put twenty of the thirty-seven guides on the page twice and cost
          1,712px at 375 for links that were already below it. Mono is reserved on this site for
          error strings, HTTP codes and file paths, so printing the literal line under the title is
          the one place that reservation pays: the titles are phrased for search ("WordPress 502 bad
          gateway") and the strings are what is actually on the visitor's screen ("502 Bad Gateway"). */}
      <section aria-labelledby="index" className="mt-16 md:mt-24">
        <h2 id="index" className={`reveal-self ${h2}`}>
          Every error, grouped by what fixes it
        </h2>
        <p className="reveal-self mt-3 max-w-[62ch] text-muted">
          Where a guide quotes the line WordPress prints, it is under the title, word for word.
        </p>
        {/* `reveal` on the flow, so the seventeen cards arrive as the reader reaches them rather
            than all at once. Task 2 left this flow out of the reveal because a transform on a
            column-fragmented box is under-specified across engines. That risk is about a box that
            actually fragments, and every card here carries `break-inside-avoid`, so none of them
            does; verified rendering at 375, 768 and 1440 before this went in. */}
        <div className="reveal mt-8 columns-1 gap-x-6 md:columns-2 lg:columns-3 lg:gap-x-8">
          {groups.map(({ s, gs }) => {
            const Mark = hubIcon[s.hub as keyof typeof hubIcon];
            return (
              // The card's edge firms when a link inside it is hovered or focused, never on the box
              // itself: a panel is not interactive, so the trigger is the control in it. Same pair
              // of properties and the same reason as the closing band's.
              <div
                key={s.id}
                className="mb-4 break-inside-avoid rounded-[14px] border border-line bg-surface p-4 shadow-card transition-colors duration-200 has-[a:focus-visible]:border-line-strong has-[a:hover]:border-line-strong md:mb-6 md:p-5"
              >
                {/* The service title is the link. It used to be a 14px sentence under the chips
                    reading "How we fix these: <service>", in ember underline, seventeen times. */}
                <h3 className="font-display text-lg font-bold [font-variation-settings:'opsz'_18]">
                  <Link href={s.path} className="group/head flex min-h-11 items-start gap-3 py-1">
                    <Mark weight="duotone" aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
                    <span className="flex-1 transition-colors duration-200 group-hover/head:text-accent-text">{s.title}</span>
                    {/* Redundant to a reader who has the rows right underneath, so it is hidden
                        from the accessible name rather than read out seventeen times. */}
                    <span aria-hidden className="mt-1 shrink-0 font-mono text-xs font-normal tabular-nums text-muted">
                      {gs.length}
                    </span>
                  </Link>
                </h3>
                <ul className="mt-3 border-t border-line pt-1">
                  {gs.map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={routes.guide(g.slug)}
                        className="group/row relative flex min-h-11 items-center gap-3 py-2 pl-4 text-[15px]"
                      >
                        {/* The rail is this row's own segment of it, so one row can light up
                            without the other three. Drawn with `inset` rather than a left border on
                            the list, which is what the old version had and what made the whole
                            group the smallest thing that could respond. */}
                        <span
                          aria-hidden
                          className="absolute top-1.5 bottom-1.5 left-0 w-px bg-line transition-colors duration-200 group-hover/row:bg-accent"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block transition-colors duration-200 group-hover/row:text-accent-text">{g.title}</span>
                          {/* No `block` beside `line-clamp-2`: both set `display` and the plain
                              utility wins over the clamp's -webkit-box, which silently turns the
                              clamp off. Long strings wrap rather than scroll, so a 90-character
                              line cannot create a scrollable region with no tab stop. */}
                          {g.errorText && (
                            <span className="mt-0.5 line-clamp-2 font-mono text-sm leading-snug text-muted [overflow-wrap:anywhere]">
                              {g.errorText}
                            </span>
                          )}
                        </span>
                        {/* The chip nudge the buttons already use: 150ms ease-out on `translate`.
                            `translate` and `opacity` are named rather than `transition-transform`,
                            which in Tailwind v4 covers neither of them. */}
                        <ArrowRightIcon
                          weight="duotone"
                          aria-hidden
                          className="size-4 shrink-0 -translate-x-1 text-accent-text opacity-0 transition-[opacity,translate] duration-150 ease-out group-hover/row:translate-x-0 group-hover/row:opacity-100 motion-reduce:transition-none"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <ClosingBand
        title="Cannot see your error here?"
        actions={
          <>
            <BookLink location="guides-index" className="btn-primary" />
            <ChatButton location="guides-index" className="btn-secondary" />
          </>
        }
      />
      <p className="mt-5 text-sm text-muted">
        Nothing down right now? <CheckLink location="guides-index" icon={null} />
      </p>
    </div>
  );
}
