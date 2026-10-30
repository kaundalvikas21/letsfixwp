import Link from "next/link";
import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { hubLead } from "@/content/hubs";
import { hubPhotos } from "@/content/photos";
import { cn } from "@/lib/utils";
import { Breadcrumbs, ClosingBand, LinkCards, PageMasthead, Section, cardLink, page, pageY } from "./parts";

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
  // The full width goes to the hub's worst problem only when that problem is also the richest thing on
  // the page: critical, and carrying the literal string WordPress prints. A 1104px box holding one 18px
  // line reads as a broken state rather than as weighting, which is what gating on urgency alone gave
  // the fix hub. Today only the security hub qualifies, and its remainder is even, so no hub is left
  // with a tile stranded beside a hole.
  const leadWide = topGuides.length > 2 && topGuides[0].urgency === "critical" && !!topGuides[0].errorText;
  const loc = `hub:${id}`;
  const intent = primaryCtaFor(node.intent);
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;

  return (
    <article className={cn(page, pageY)}>
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
        <LinkCards
          cols={4}
          items={serviceChildren.map((n) => ({
            href: n.path,
            title: n.title,
            summary: getService(serviceIdOf(n.path))?.summary,
          }))}
        />
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
        <Section id="guides" title="Most urgent problems" className="mt-16 md:mt-16">
          <ul className="grid items-start gap-4 sm:grid-cols-2">
            {topGuides.map((g, i) => (
              <li key={g.slug} className={cn(leadWide && i === 0 && "sm:col-span-2")}>
                <Link
                  href={routes.guide(g.slug)}
                  className={cardLink}
                >
                  <span className="block font-display text-lg font-bold transition-colors duration-200 [font-variation-settings:'opsz'_18] group-hover:text-accent-text">
                    {g.title}
                  </span>
                  {/* The literal string the owner is staring at, in the one typeface this variation
                      allows for it. Two lines: it is here to be recognised, not read. */}
                  {/* No `block` beside `line-clamp-2`: both set `display`, and the plain utility wins over
                      the clamp's -webkit-box, which silently turns the clamp off. */}
                  {/* The urgency is not printed on the row. It sorts the list and it decides which panel
                      takes the full width; a ranked list under a heading that reads "Most urgent
                      problems" does not also need every row to restate its rank, and on three of the
                      four hubs that render this the word either repeated or contradicted the heading. */}
                  {g.errorText && <span className="mt-3 line-clamp-2 font-mono text-[15px] leading-snug text-muted">{g.errorText}</span>}
                </Link>
              </li>
            ))}
          </ul>
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
    </article>
  );
}
