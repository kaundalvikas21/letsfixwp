import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { Photo } from "@/components/sections/v3/Photo";
import { SiteStatus } from "@/components/SiteStatus";
import { primaryCtaFor } from "@/config/cta";
import { routes } from "@/config/routes";
import { getGuide } from "@/content";
import { railPoints } from "@/content/notices";
import { servicePhotos } from "@/content/photos";
import type { Service } from "@/content/schema";
import { bentoSpans } from "@/lib/bento";
import { cn } from "@/lib/utils";
import { Breadcrumbs, FactRail, Faqs, h1, h2, LinkList, LinkRows, page, Section, TickList } from "./parts";

const Primary = ({ intent, ...rest }: { intent: ReturnType<typeof primaryCtaFor>; location: string; service: string; className?: string }) =>
  intent === "PLANS" ? <PlansLink {...rest} /> : intent === "QUOTE" ? <QuoteLink {...rest} /> : <BookLink {...rest} />;

// What we do is 3 to 5 steps (serviceSchema), laid out in source order, which is the order the work happens in.
// bentoSpans packs them into rows of 6 and gives the longer detail the wider cell; these are the only three
// spans it returns, written out so Tailwind sees them.
const SPAN = { 2: "md:col-span-2", 4: "md:col-span-4", 6: "md:col-span-6" } as const;

/**
 * /<hub>/<service>/. Layout family: lead column with a sticky conversion rail (lg), which no home section uses.
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

      {/* Hero: the photo frame takes its height from the title block at lg instead of a fixed ratio, which is
          what keeps it off the hub hero's 4/3 box. Entrance is CSS only, so no client JS enters the LCP path. */}
      <header className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
        <div className="lg:col-span-7 lg:flex lg:flex-col lg:justify-center">
          <h1 className={h1}>{s.h1}</h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Primary intent={intent} location={`${loc}:hero`} service={s.id} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} service={s.id} className="btn-secondary" />
          </div>
          {s.intent === "fix" && <SiteStatus />}
        </div>
        <div className="lg:col-span-5">
          <div className="aspect-[16/10] overflow-hidden rounded-[20px] shadow-card motion-safe:animate-[settle_600ms_var(--ease-spring)_both] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
            <Photo id={servicePhotos[s.id]} decorative preload sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <p className="max-w-[68ch] font-display text-xl leading-snug font-bold md:text-2xl">{s.summary}</p>
          {/* whoItsFor is written for all 32 services. A definition row keeps it distinct from the symptoms
              checklist below, which answers a different question on the same page. */}
          <dl className="mt-7 max-w-[68ch] border-t border-line pt-5">
            <dt className="text-sm font-semibold">Who this is for</dt>
            <dd className="mt-1.5 text-muted">{s.whoItsFor}</dd>
          </dl>

          {s.symptoms.length > 0 && (
            <Section id="symptoms" title="Does your site show this?">
              <TickList items={s.symptoms} />
            </Section>
          )}

          <Section id="what-we-do" title="What we do">
            <ol className="grid gap-4 md:grid-cols-6 md:gap-5">
              {s.whatWeDo.map((w, i) => (
                <li
                  key={w.verb}
                  className={cn(
                    "flex h-full min-h-40 flex-col rounded-[20px] border border-line bg-surface p-6 shadow-card md:min-h-0",
                    SPAN[spans[i] as keyof typeof SPAN],
                  )}
                >
                  <span className="font-display text-sm font-bold tracking-wide text-accent-text">{w.verb}</span>
                  <p className="mt-2 max-w-[56ch] text-sm">{w.detail}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* Deliverables are the outcome the page is selling, so they get a panel of statements rather than a
              second tick list (contract rule 3: one layout family per page). */}
          <Section id="deliverables" title="What you get">
            <ul className="divide-y divide-line overflow-hidden rounded-[20px] bg-accent-tint px-6 shadow-card md:px-8">
              {s.deliverables.map((d) => (
                <li key={d} className="py-5">
                  <span className="block max-w-[52ch] font-display text-lg leading-snug font-bold">{d}</span>
                </li>
              ))}
            </ul>
          </Section>

          {guides.length > 0 && (
            <Section id="guides" title="Errors we fix here">
              <LinkRows items={guides.map((g) => ({ href: routes.guide(g.slug), title: g.title, summary: g.symptoms[0] }))} />
            </Section>
          )}

          <Faqs faqs={s.faqs} />

          {s.relatedPaths.length > 0 && (
            <Section id="related" title="Related">
              <LinkList paths={s.relatedPaths} />
            </Section>
          )}
        </div>

        {/* Conversion rail: one node at every width. Below lg it falls into flow here, after Related and before
            the closing band, carrying the guarantee and the claims; the global bottom bar remains the CTA there. */}
        <aside className="lg:col-span-4">
          <FactRail title={s.title} facts={facts} points={points}>
            <Primary intent={intent} location={`${loc}:rail`} service={s.id} className="btn-primary w-full" />
            <ChatButton location={`${loc}:rail`} service={s.id} className="btn-secondary w-full" />
          </FactRail>
        </aside>
      </div>

      {/* Closing band: split, not a centred panel, so it does not repeat the home page's final CTA family. */}
      <section aria-labelledby="closing" className="mt-16 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <h2 id="closing" className={cn(h2, "max-w-[24ch]")}>
          {s.title}
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Primary intent={intent} location={`${loc}:closing`} service={s.id} className="btn-primary" />
          <ChatButton location={`${loc}:closing`} service={s.id} className="btn-secondary" />
        </div>
      </section>
    </article>
  );
}
