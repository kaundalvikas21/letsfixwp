import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { guidesFor } from "@/content";
import { hubLead } from "@/content/hubs";
import { hubPhotos } from "@/content/photos";
import { cn } from "@/lib/utils";
import { Breadcrumbs, ClosingBand, PageMasthead, Section, ServiceCards, page, pageY, urgencyIcon } from "./parts";

const urgencyRank = { critical: 0, high: 1, standard: 2 } as const;

/**
 * /<hub>/. Layout family: a full-width lead block over a two-column service directory, with a weighted
 * problem grid below it. Neither the home bento nor the home command palette, and not the service
 * page's sticky rail.
 *
 * Rhythm, which departs from the inner-template baseline on purpose (docs/layout-ledger.md records
 * `Section` at mt-16 md:mt-24): a hub is three or four beats, not a seven-section reading document, so
 * running them all at one interval leaves the page with no cadence at all. Desktop reads 128 / 64 / 112,
 * which needs the override written at both modifiers (`mt-16 md:mt-16`): tailwind-merge only resolves a
 * conflict within one modifier, so a bare `mt-16` leaves the base `md:mt-24` standing and ships 96.
 * The directory opens wide because it is what the page is for, the problem grid sits close under it
 * because those problems belong to the services above, and the closing band opens again. Stacked, every
 * interval stays at or above the 64 the ledger set as the floor, because at 375 anything less merges
 * two sections into one.
 */
export function HubTemplate({ node }: { node: FlatNode }) {
  const id = hubIdOf(node.path);
  const children = nodes.filter((n) => n.parentPath === node.path);
  const serviceChildren = children.filter((n) => n.kind === "service");
  const otherChildren = children.filter((n) => n.kind !== "service");
  const topGuides = serviceChildren
    .flatMap((n) => guidesFor(serviceIdOf(n.path)))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])
    .slice(0, 6);
  const loc = `hub:${id}`;
  const intent = primaryCtaFor(node.intent);
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;

  return (
    <div className={cn(page, pageY)}>
      <Breadcrumbs items={nodeCrumbs(node.path)} />

      {/* The hub's photograph used to sit in a 5-column box beside the lead. It is the band itself
          now, which is what the owner asked for across every inner page and the shape /about/ had
          already proved: the type on the picture rather than next to it. The 6 / empty / 5 split
          goes with it, and so does the hand-written `sizes` for a 432px box that no longer exists.
          The beat is unchanged, headline then lead then buttons, and `PageMasthead` holds it. */}
      <PageMasthead
        photo={hubPhotos[id]}
        title={node.title}
        lead={hubLead[id]}
        actions={
          <>
            <Primary location={`${loc}:hero`} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} className="btn-secondary" />
          </>
        }
      />

      <Section id="services" title="What we do here" className="mt-20 md:mt-32">
        {/* Ruled rows before this: one column of titles, one of summaries, a caret at the end. The
            directory is the page's whole job, and every row is a different service page, so it reads
            as a set of doors rather than a list to work down. Four across on the spine, which is the
            widest the ban on three equal cards in a row allows. */}
        <ServiceCards nodes={serviceChildren} />
        {otherChildren.map((n) => (
          <p key={n.path} className="mt-6">
            <Link href={n.path} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
              {n.title}
            </Link>
          </p>
        ))}
      </Section>

      {topGuides.length > 0 && (
        // Sits close under the directory at desktop: these are the errors the services above fix, not
        // a third subject. Four of the six hubs have guides and render the grid (fix 6 panels, security 5, performance-migration 4,
        // woocommerce 2); maintenance and development have none and render nothing here.
        /* Ruled rows, not a second card grid. "What we do here" above became `LinkCards` in Task 9
            and this section stayed a 2-up grid, so from that point the page ran two card grids back to
            back that differed only in column count, which is what made this one read as a weaker copy
            of the one above it. Rows restore the alternation the page was designed with.

            An `ol` because the order is the information: the list is sorted by `urgencyRank` and
            first place is the hub's worst problem. That is also what replaced `leadWide`, which used
            to give the full spine to that problem because a grid has no way to rank except by area.

            No numerals. Rule 6 bans step labels, and the urgency mark plus the position already say
            the rank twice; a numeral would say it a third time. */
        <Section id="guides" title="Most urgent problems" className="mt-16 md:mt-16">
          <ol className="reveal border-t border-line">
            {topGuides.map((g) => {
              // Three shapes, one accent: the octagon, the triangle and the wrench differ in form and
              // not in hue, which is what keeps the rank off a colour-only indicator. It sorts the
              // list and now it also shows on the row, which the grid never did.
              const Mark = urgencyIcon[g.urgency];
              return (
                <li key={g.slug}>
                  <Link
                    href={routes.guide(g.slug)}
                    className="group flex items-center gap-4 border-b border-line py-5 transition-[border-color] duration-200 motion-reduce:transition-none [@media(hover:hover)]:hover:border-line-strong"
                  >
                    <Mark weight="duotone" aria-hidden className="size-6 shrink-0 text-accent-text" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-bold transition-colors duration-200 [font-variation-settings:'opsz'_18] motion-reduce:transition-none group-hover:text-accent-text">
                        {g.title}
                      </span>
                      {/* The literal string the owner is staring at, in the one typeface this
                          variation allows for it. One line here rather than the grid's two: a row is
                          scanned, and the guide page prints it in full. No `block` beside
                          `line-clamp-1`, because both set `display` and the plain utility wins over
                          the clamp's -webkit-box, which silently turns the clamp off.

                          Only 20 of the 37 guides carry a literal string, so on most hubs four of
                          six rows had nothing under the title and the list read thin. The first
                          symptom is the fallback: it is the same sentence the error cards already
                          print as their summary, so no new content is invented, and it is set in the
                          body face rather than the mono, because mono on this site means a string
                          the site actually prints and a symptom is our words, not WordPress's. */}
                      {g.errorText ? (
                        <span className="mt-1 line-clamp-1 font-mono text-[15px] leading-snug text-muted">{g.errorText}</span>
                      ) : (
                        g.symptoms[0] && <span className="mt-1 line-clamp-1 text-[15px] leading-snug text-muted">{g.symptoms[0]}</span>
                      )}
                    </span>
                    <CaretRightIcon
                      aria-hidden
                      className="size-5 shrink-0 text-accent-text transition-[translate] duration-200 motion-reduce:transition-none [@media(hover:hover)]:group-hover:translate-x-1 motion-reduce:translate-none!"
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="mt-6">
            <Link href={routes.guides} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
              Every error we have written up
            </Link>
          </p>
        </Section>
      )}

      {/* It used to set the h1 again word for word, so "WordPress Fixes & Error Resolution" appeared
          twice on one page and the last thing the page said was its own title. This is the question a
          visitor who has just read three to eleven service rows actually has, and it gives the two
          buttons beside it something to answer. */}
      <ClosingBand
        title="Not sure which one you need?"
        actions={
          <>
            <Primary location={`${loc}:closing`} className="btn-primary" />
            <ChatButton location={`${loc}:closing`} className="btn-secondary" />
          </>
        }
      />
    </div>
  );
}
