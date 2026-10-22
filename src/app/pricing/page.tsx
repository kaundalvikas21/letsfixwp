import { CaretRightIcon, CheckIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { ReactNode } from "react";
import { BookLink, ChatButton, CheckLink, PlansLink, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, Faqs, h1, h2, page, Section } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";
import { getService, services } from "@/content";
import { claimLine } from "@/content/notices";
import { annualSaving, formatPrice, prices, type Price } from "@/content/pricing";
import type { Service } from "@/content/schema";
import { cn } from "@/lib/utils";

const PlanPrice = dynamic(() => import("@/components/sections/v3/PlanPrice").then((m) => m.PlanPrice));

export const metadata: Metadata = {
  title: "Pricing",
  description: "WordPress fixes, care plans and projects: what each one covers, what you get, and how the price is set before work starts.",
  alternates: { canonical: routes.pricing },
};

/**
 * The page's one price slot, and the reason this page exists in this shape. Every priceFrom is null and every
 * value in src/content/pricing.ts is null, so rule 8 renders nothing for the figure; the slot then states how
 * the price is set instead of standing empty, and prints the real "From" line the moment a price is published.
 * No figure here is invented, derived or stood in for.
 */
function PriceSlot({ price, unit }: { price: Price | null; unit: string }) {
  return price ? (
    <div>
      <p className="font-display text-4xl leading-none font-extrabold">From {formatPrice(price)}</p>
      <p className="mt-2 text-sm text-muted">{unit}</p>
    </div>
  ) : (
    // One source for the unit: every unit reads "Per <something>", so the quoted line is the same words.
    <p className="font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.02em] text-balance">Quoted {unit.toLowerCase()}</p>
  );
}

const { planMonthly: m, planAnnual: a } = prices;
const saving = annualSaving(m, a);

// Care plan billing, stated only as far as the content backs it. "Per month" is what care-plans.summary calls
// the plan ("A monthly plan where we handle updates, backups, monitoring and security checks"), so it holds
// with nothing published. An annual option is named only once planAnnual is published, and the annual price
// alone switches the card to it rather than being ignored.
const planUnit = m && a ? "Monthly or annual" : a ? "Per year" : "Per month";

type Tier = {
  intent: Service["intent"];
  name: string;
  who: string;
  /** The service that is this tier's entry point. Named on the card and in the table, so neither claims to cover every service under the tier. */
  anchor: Service;
  unit: string;
  price: Price | null;
  /** The care plan only: both prices published is the one case that earns the billing toggle. */
  toggle?: boolean;
  cta: ReactNode;
  featured?: boolean;
  order: string;
};

/**
 * One tier per Service.intent, which is the grouping the content already has: 15 fix, 3 plan, 14 project.
 * DOM order puts the care plan first, because that is the order the cards scroll in below 768px; md:order
 * restores 1-2-3 on the grid. The project tier has no entry in src/content/pricing.ts and never prints a
 * figure: a project is quoted from its brief.
 */
const TIERS: Tier[] = [
  {
    intent: "plan",
    name: "Care plan",
    who: "Updates, backups and monitoring, handled every month.",
    anchor: getService("care-plans")!,
    unit: planUnit,
    price: m ?? a,
    toggle: true,
    cta: <PlansLink location="pricing:tiers" className="btn-primary w-full" />,
    featured: true,
    order: "md:order-2",
  },
  {
    intent: "fix",
    name: "One-time fix",
    who: "One problem on your site, found and fixed.",
    anchor: getService("emergency")!,
    unit: "Per fix",
    price: prices.fix,
    cta: <BookLink location="pricing:tiers" className="btn-secondary w-full" />,
    order: "md:order-1",
  },
  {
    intent: "project",
    name: "Project",
    who: "A build, a move or a redesign, agreed up front.",
    anchor: getService("website-design")!,
    unit: "Per project",
    // No project entry exists in src/content/pricing.ts and none is implied: a project is quoted from its brief.
    price: null,
    cta: <QuoteLink location="pricing:tiers" className="btn-secondary w-full" />,
    order: "md:order-3",
  },
];

/** Reading order for everything below the cards: fix, plan, project, as the grid reads at md. */
const READING = ["fix", "plan", "project"].map((i) => TIERS.find((t) => t.intent === i)!);

// Questions about price, referenced from the service files by exact question text, the mechanism the home Faq
// section uses: reword one in the content and the build fails here instead of the two drifting apart.
// Left out on purpose, and for a reason each: care-plans "What is the difference between Basic, Pro and
// Business?" names three tiers this page does not itemise, and maintenance-woocommerce "Where can I see plan
// prices?" answers "ask us", which on the page someone opened to see prices is the page deflecting the question
// it exists to answer.
const FAQ_REFS: [service: string, question: string][] = [
  ["website-design", "How much does a WordPress website cost?"],
  ["care-plans", "Is a care plan better than paying per job?"],
  ["support-hours", "Should I choose hours or a care plan?"],
  ["support-hours", "How do I know how many hours a task will use?"],
  ["support-hours", "Do unused hours expire?"],
  ["hire-developer", "What does it cost to hire a WordPress developer?"],
  ["white-label", "How is white-label work priced?"],
];

const faqs = FAQ_REFS.map(([id, q]) => {
  const found = getService(id)?.faqs.find((f) => f.q === q);
  if (!found) throw new Error(`Pricing: service "${id}" no longer has the question "${q}"`);
  return found;
});

// Rows of the comparison table. Each cell is written content from the tier's anchor service, so the table makes
// no claim of its own. Turnaround is null on all 32 services today, so that row renders only once one is set.
const ROWS: { label: string; cell: (t: Tier) => ReactNode }[] = [
  { label: "Who it is for", cell: (t) => t.anchor.whoItsFor },
  { label: "How the work runs", cell: (t) => t.anchor.whatWeDo.map((w) => w.verb).join(", ") },
  {
    label: "What you get",
    cell: (t) => (
      <ul className="space-y-2">
        {t.anchor.deliverables.map((d) => (
          <li key={d} className="flex gap-2">
            <CheckIcon weight="duotone" className="mt-1 size-4 shrink-0 text-accent-text" aria-hidden />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    ),
  },
  { label: "How it is priced", cell: (t) => t.unit },
];

const th = "border-b border-line-strong px-4 py-3 text-left align-bottom font-display text-sm font-bold";
const td = "border-b border-line px-4 py-4 align-top text-sm";
// On --surface-2 small accent text measures 4.31:1 (MASTER.md:49), so the quiet links in the closing row are
// underlined body text rather than accent text. min-h-11 makes each one a 44px target (contract rule 5).
const quietLink = "inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:no-underline";

export default function Pricing() {
  const turnaround = READING.some((t) => t.anchor.typicalTurnaround);
  const rows = turnaround ? [...ROWS, { label: "Typical turnaround", cell: (t: Tier) => t.anchor.typicalTurnaround }] : ROWS;
  // Only the values this page can actually show: the fix tier, the plan tier and the per-service rows.
  const published = [prices.fix, m, a].some(Boolean) || services.some((s) => !!s.priceFrom);

  return (
    <div className={cn(page, "py-8 md:py-12")}>
      <JsonLd data={faqLd(faqs)} />
      <Breadcrumbs items={nodeCrumbs(routes.pricing)} />

      <header className="mt-6">
        <h1 className={h1}>Pricing</h1>
        <p className="mt-5 max-w-[68ch] text-lg text-muted">
          {published
            ? "Starting prices are published below. Anything without one is quoted once an engineer has seen your site."
            : "Nothing here is a guess. An engineer looks at your site first, then quotes the work."}
        </p>
        {/* The one wording of this claim, and its gate, both live in src/content/notices.ts. */}
        {brand.claims.fixedPrice && <p className="mt-3 max-w-[68ch] text-muted">{claimLine.fixedPrice}</p>}
      </header>

      <Section id="tiers" title="How the work is priced">
        <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-2 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:items-stretch md:gap-6 md:overflow-visible md:px-0">
          {TIERS.map((t) => (
            <li
              key={t.name}
              className={cn(
                "flex w-[85%] shrink-0 snap-start flex-col rounded-[20px] bg-surface p-6 shadow-card md:w-auto md:p-8",
                t.order,
                // Accent ring and a 1.04 scale on the centre tier, the home page's own answer to rule 6. Resting
                // elevation stays shadow-card: --shadow-lift is MASTER's hover shadow (MASTER.md:99,204).
                t.featured ? "z-10 ring-2 ring-accent md:scale-[1.04]" : "border border-line",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-bold">{t.name}</h3>
                {/* The ring is not allowed to carry "this one" on its own (rule 9), so the badge is the text
                    that says what the ringed card is. "Best value" is a ranking and needs published prices to
                    bear it out; "Ongoing" is simply what a care plan is, and holds in either state. */}
                {t.featured && (
                  <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">
                    {prices.planIsBestValue ? "Best value" : "Ongoing"}
                  </span>
                )}
              </div>
              <p className="mt-1 text-muted">{t.who}</p>
              <div className="mt-6">
                {/* MASTER.md:222-225 asks for the billing toggle and PlanPrice is the component that decides it:
                    it renders only when both plan prices are published, so rule 8 never has it switching between
                    two blanks. One price of the two still prints as an ordinary "From" line. */}
                {t.toggle && m && a ? (
                  <PlanPrice monthly={formatPrice(m)} annual={formatPrice(a)} saving={saving && formatPrice(saving)} />
                ) : (
                  <PriceSlot price={t.price} unit={t.unit} />
                )}
              </div>
              {/* The inclusions are one named service's deliverables, so the line that heads them says whose. */}
              <p className="mt-7 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                Included in{" "}
                <Link href={routes.service(t.anchor.id)} className="inline-flex min-h-11 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
                  {t.anchor.title}
                </Link>
              </p>
              <ul className="mt-1 space-y-3 text-[15px]">
                {t.anchor.deliverables.slice(0, 4).map((d) => (
                  <li key={d} className="flex gap-3">
                    <CheckIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              {/* mt-auto needs the cells stretched to equal height, which md:items-stretch above is for: under
                  md:items-center each card was content height and the three CTAs sat at three different heights. */}
              <div className="mt-auto pt-8">{t.cta}</div>
            </li>
          ))}
        </ul>
      </Section>

      {/* All 32 services, grouped under their tier instead of their hub, each row carrying the outcome it sells
          (its first deliverable) and its own published price and turnaround when either is set. */}
      <Section id="services" title="Every service, grouped by the work">
        {READING.map((t) => {
          const list = services.filter((s) => s.intent === t.intent);
          return (
            <div key={t.intent} className="mt-10 first:mt-0">
              {/* No unit beside the group name: the plan tier holds support-hours, which is bought as a block
                  of hours rather than per month, so a tier-wide billing label would be wrong for it. */}
              <h3 className="border-b border-line pb-3 font-display text-xl leading-snug font-bold">{t.name}</h3>
              <ul className="mt-5 divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface shadow-card">
                {list.map((s) => (
                  <li key={s.id}>
                    <Link href={routes.service(s.id)} className="group flex min-h-14 items-start gap-4 px-5 py-4 hover:bg-surface-2 sm:px-6">
                      <span className="min-w-0 flex-1">
                        {/* The hover affordance is the row tint and the chevron, not accent text: an 18px bold
                            title is not WCAG large text, and accent on --surface-2 measures 4.31:1
                            (MASTER.md:49). The chevron is an icon, so 3:1 applies and the accent holds. */}
                        <span className="block font-display text-lg leading-snug font-bold">{s.title}</span>
                        <span className="mt-1 block max-w-[70ch] text-sm text-muted">{s.deliverables[0]}</span>
                      </span>
                      {(s.priceFrom || s.typicalTurnaround) && (
                        <span className="shrink-0 text-right text-sm">
                          {s.priceFrom && <span className="block font-display font-bold">From {s.priceFrom}</span>}
                          {s.typicalTurnaround && <span className="block text-muted">{s.typicalTurnaround}</span>}
                        </span>
                      )}
                      <CaretRightIcon
                        weight="duotone"
                        className="mt-1 size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </Section>

      <Section id="compare" title="What each one covers">
        {/* Scrolls sideways inside its own region below 768px rather than squeezing three columns of text.
            tabIndex makes that scroll keyboard operable (axe scrollable-region-focusable). */}
        <div
          role="region"
          aria-label="The three kinds of work compared"
          tabIndex={0}
          className="overflow-x-auto rounded-[20px] border border-line bg-surface shadow-card"
        >
          <table className="w-full min-w-[48rem] border-collapse">
            <caption className="sr-only">
              One-time fix, care plan and project compared, each shown through the service that is its entry point.
            </caption>
            <thead>
              <tr>
                <th scope="col" className={th}>
                  <span className="sr-only">What is compared</span>
                </th>
                {READING.map((t) => (
                  <th key={t.name} scope="col" className={th}>
                    {t.name}
                    <span className="mt-1 block text-xs font-medium text-muted">{t.anchor.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className={cn(td, "font-semibold")}>
                    {r.label}
                  </th>
                  {READING.map((t) => (
                    <td key={t.name} className={cn(td, "text-muted")}>
                      {r.cell(t)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Faqs faqs={faqs} title="Questions about price" />

      <section aria-labelledby="pricing-closing" className="mt-16 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <h2 id="pricing-closing" className={cn(h2, "max-w-[24ch]")}>
          Get a price for your site
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <BookLink location="pricing:closing" className="btn-primary" />
          <PlansLink location="pricing:closing" className="btn-secondary" />
        </div>
      </section>
      {/* gap-y as well as gap-x: these two 44px targets wrap onto separate lines at 375, and without it they
          would stack with nothing between them (contract rule 5 asks for 8px between targets). */}
      <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted">
        Not urgent? <CheckLink location="pricing:closing" className={quietLink} /> or{" "}
        <ChatButton location="pricing:closing" className={quietLink} />
      </p>
    </div>
  );
}
