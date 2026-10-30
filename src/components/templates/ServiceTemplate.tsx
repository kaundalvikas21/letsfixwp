import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { ClosingCta } from "@/components/sections/v3/ClosingCta";
import { Illustration } from "@/components/sections/v3/Photo";
import { SiteStatus } from "@/components/SiteStatus";
import { primaryCtaFor } from "@/config/cta";
import { getGuide } from "@/content";
import { heroChips, jobSteps, railPoints } from "@/content/notices";
import { serviceArt } from "@/content/photos";
import type { Service } from "@/content/schema";
import { bentoSpans } from "@/lib/bento";
import { cn } from "@/lib/utils";
import {
  Breadcrumbs,
  cardGridInColumn,
  FactRail,
  Faqs,
  GuideCard,
  h1,
  page,
  RelatedGrid,
  Section,
  StepRow,
  TickList,
  TrustChips,
  whatWeDoIcons,
} from "./parts";

const Primary = ({ intent, ...rest }: { intent: ReturnType<typeof primaryCtaFor>; location: string; service: string; className?: string }) =>
  intent === "PLANS" ? <PlansLink {...rest} /> : intent === "QUOTE" ? <QuoteLink {...rest} /> : <BookLink {...rest} />;

// What we do is 3 to 5 steps (serviceSchema), laid out in source order, which is the order the work happens in.
// bentoSpans packs them into rows of 6 and gives the longer detail the wider cell; these are the only three
// spans it returns, written out so Tailwind sees them.
const SPAN = { 2: "md:col-span-2", 4: "md:col-span-4", 6: "md:col-span-6" } as const;

/**
 * /<hub>/<service>/. Layout family: lead column with the shared conversion rail, which no home section uses. One
 * `FactRail` node at every width: in flow below the body column under lg as a reassurance panel, and `lg:sticky`
 * beside it from lg (parts.tsx).
 * Hero carries no subtext: the shortest line in the content is 25+ words, over the contract's 20-word hero cap,
 * so service.summary renders as the lead statement under the hero instead. whoItsFor follows it as a definition
 * row on every intent; the symptoms checklist is fix-only, because serviceSchema keeps symptoms empty otherwise.
 */
export function ServiceTemplate({ service: s }: { service: Service }) {
  const intent = primaryCtaFor(s.intent);
  const loc = `service:${s.id}`;
  const guides = s.guideSlugs.map((slug) => getGuide(slug)!).filter(Boolean);
  const facts = [
    s.typicalTurnaround && { k: "Typical turnaround", v: s.typicalTurnaround },
    s.priceFrom && { k: "From", v: s.priceFrom },
  ].filter((x): x is { k: string; v: string } => !!x);
  // Claim copy, its brand.claims gating and now the set itself all live in src/content/notices.ts: the two rails
  // asked for different sets with no recorded reason, so both read the one `railPoints` order.
  const points = railPoints;
  const spans = bentoSpans(s.whatWeDo.map((w) => w.detail.length));

  return (
    <article data-intent={s.intent} className={cn(page, "py-8 md:py-12")}>
      <JsonLd data={[serviceLd(s), faqLd(s.faqs)]} />
      <Breadcrumbs items={nodeCrumbs(s.path)} />

      {/* Hero: the frame takes its height from the title block at lg instead of a fixed ratio, which is what
          keeps it off the hub hero's box. Entrance is CSS only, so no client JS enters the LCP path. */}
      <header className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
        <div className="min-w-0 lg:col-span-7 lg:flex lg:flex-col lg:justify-center">
          <h1 className={h1}>{s.h1}</h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Primary intent={intent} location={`${loc}:hero`} service={s.id} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} service={s.id} className="btn-secondary" />
          </div>
          {s.intent === "fix" && <SiteStatus />}
          {/* Inside the hero, not its own section: see TrustChips in parts.tsx for why. */}
          <TrustChips items={heroChips} />
        </div>
        <div className="lg:col-span-5">
          {/* The illustration, not a photograph: every page on the site is illustrated now, and the subject
              follows the service through `serviceArt` (src/content/photos.ts). */}
          <div className="aspect-[16/10] overflow-hidden rounded-[20px] shadow-card motion-safe:animate-[settle_600ms_var(--ease-spring)_both] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
            <Illustration id={serviceArt(s)} preload sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* min-w-0: a grid item takes its automatic minimum from min-content, so one unbreakable string in here
            (an error line, a file path) would widen the column and scroll the page sideways at 375. */}
        <div className="min-w-0 lg:col-span-8">
          <p className="max-w-[68ch] font-display text-xl leading-snug font-bold md:text-2xl">{s.summary}</p>
          {/* whoItsFor is written for all 32 services. A definition row keeps it distinct from the symptoms
              checklist below, which answers a different question on the same page. */}
          <dl className="mt-7 max-w-[68ch] border-t border-line pt-5">
            <dt className="text-sm font-semibold">Who this is for</dt>
            <dd className="mt-1.5 text-muted">{s.whoItsFor}</dd>
          </dl>

          {s.symptoms.length > 0 && (
            <Section id="symptoms" revealBody={false} title="Does your site show this?">
              <TickList items={s.symptoms} />
            </Section>
          )}

          {/* The sequence every job runs, shared with the home page's tabbed showcase so the two cannot
              describe a different process. Generic to all 32 services, so this needed no new copy. */}
          <Section id="how-it-runs" revealBody={false} title="How this job runs">
            <StepRow steps={jobSteps} />
          </Section>

          <Section id="what-we-do" revealBody={false} title="What we do">
            <ol className="grid gap-4 md:grid-cols-6 md:gap-5">
              {s.whatWeDo.map((w, i) => (
                <li
                  data-reveal
                  key={w.verb}
                  style={{ "--i": i } as React.CSSProperties}
                  className={cn(
                    "flex h-full min-h-40 min-w-0 flex-col rounded-[20px] border border-line bg-surface p-6 shadow-card md:min-h-0",
                    SPAN[spans[i] as keyof typeof SPAN],
                  )}
                >
                  {(() => {
                    // Verified at build: parts.tsx fails type-check naming the verb if one has no icon.
                    const I = whatWeDoIcons[w.verb]!;
                    return <I weight="duotone" className="size-7 text-accent-text" aria-hidden />;
                  })()}
                  <span className="mt-3 font-display text-sm font-bold tracking-wide text-accent-text">{w.verb}</span>
                  <p className="mt-2 max-w-[56ch] text-sm">{w.detail}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* Deliverables are the outcome the page is selling, so they get a panel of statements rather than a
              second tick list (contract rule 3: one layout family per page). */}
          <Section id="deliverables" revealBody={false} title="What you get">
            {/* One illustration breaks the long text column at its midpoint, which is the only place on this
                page a picture does work the copy cannot. */}
            <div className="mb-5 aspect-[16/10] overflow-hidden rounded-[20px] shadow-card">
              <Illustration id={serviceArt(s)} sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
            <ul className="divide-y divide-line overflow-hidden rounded-[20px] bg-accent-tint px-6 shadow-card md:px-8">
              {s.deliverables.map((d, i) => (
                <li key={d} data-reveal style={{ "--i": i } as React.CSSProperties} className="py-5">
                  <span className="block max-w-[52ch] font-display text-lg leading-snug font-bold">{d}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* The same card grid the hub's urgent list and the guide page's siblings use, through GuideCard, so
              one error is described identically wherever it appears. It was a stacked row list carrying the title
              and one symptom; the card adds the urgency badge and the literal message, which is what a reader
              arriving from the error on their screen is matching against. */}
          {guides.length > 0 && (
            <Section id="guides" revealBody={false} title="Errors we fix here">
              <ol className={cardGridInColumn}>
                {guides.map((g, i) => (
                  <GuideCard key={g.slug} guide={g} index={i} />
                ))}
              </ol>
            </Section>
          )}

          <Faqs faqs={s.faqs} />

          {s.relatedPaths.length > 0 && (
            <Section id="related" title="Related">
              <RelatedGrid paths={s.relatedPaths} />
            </Section>
          )}
        </div>

        {/* Conversion rail: one node at every width. Below lg it falls into flow here, after Related and before
            the closing panel, carrying the guarantee and the claims; the global bottom bar remains the CTA there. */}
        <aside className="lg:col-span-4">
          <FactRail title={s.title} facts={facts} points={points}>
            <Primary intent={intent} location={`${loc}:rail`} service={s.id} className="btn-primary w-full" />
            <ChatButton location={`${loc}:rail`} service={s.id} className="btn-secondary w-full" />
          </FactRail>
        </aside>
      </div>

      <ClosingCta
        id="closing"
        title={s.title}
        sub="Tell us what the site is doing and an engineer picks it up. Nothing starts until you have approved the work."
        intent={intent}
        location={`${loc}:closing`}
        service={s.id}
      />
    </article>
  );
}
