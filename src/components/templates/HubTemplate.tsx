import Link from "next/link";
import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { hubLead } from "@/content/hubs";
import { hubPhotos } from "@/content/photos";
import { cn } from "@/lib/utils";
import { Breadcrumbs, LinkRows, Section, h1, h2, page, pageY } from "./parts";

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

      {/* The headline takes the whole 1104px spine instead of five sevenths of it, which is what makes
          this opening a hub's rather than a service's: the hub titles are short enough to set on one
          line at that width, and the lead and the photograph then sit under it in a 6 / empty / 5 split
          rather than the service page's 7 / 5. The headline paints at once (it is the LCP element),
          then what it means, then the buttons that act on it, 70ms apart. CSS and no observer: all
          three are above the fold. */}
      <header className="mt-6">
        <h1 className={h1}>{node.title}</h1>
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="rise-in max-w-[68ch] text-lg text-muted" style={{ animationDelay: "70ms" }}>
              {hubLead[id]}
            </p>
            <div className="rise-in mt-7 flex flex-wrap gap-3" style={{ animationDelay: "140ms" }}>
              <Primary location={`${loc}:hero`} className="btn-primary" />
              <ChatButton location={`${loc}:hero`} className="btn-secondary" />
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="aspect-[4/3] overflow-hidden rounded-[14px] shadow-card">
              {/* 432px is the real box: 5 columns of a 12-column grid on a 1104px container with 48px
                  gutters. The 40vw it declared before preloaded a 576px candidate into it at 1440. */}
              <Photo id={hubPhotos[id]} decorative preload sizes="(min-width: 1024px) 432px, 100vw" />
            </div>
          </div>
        </div>
      </header>

      <Section id="services" title="What we do here" className="mt-20 md:mt-32">
        <LinkRows
          split
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
                  className="group block rounded-[14px] border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-lift"
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
      <section
        aria-labelledby="hub-closing"
        className="reveal mt-20 flex flex-col gap-5 border-t border-line pt-10 md:mt-28 md:flex-row md:items-center md:justify-between md:pt-12"
      >
        <h2 id="hub-closing" className={cn(h2, "max-w-[24ch]")}>
          Not sure which one you need?
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Primary location={`${loc}:closing`} className="btn-primary" />
          <ChatButton location={`${loc}:closing`} className="btn-secondary" />
        </div>
      </section>
    </article>
  );
}
