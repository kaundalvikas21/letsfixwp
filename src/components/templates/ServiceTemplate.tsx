import { Check } from "@phosphor-icons/react/ssr";
import { BookLink, ChatButton, CtaPair, PlansLink, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { BrowserFrame } from "@/components/sections/v1/BrowserFrame";
import { body, CtaBand, h1, h2, lead, pageWrap } from "@/components/sections/v1/page-kit";
import { brand } from "@/config/brand";
import { primaryCtaFor } from "@/config/cta";
import { routes } from "@/config/routes";
import { getGuide } from "@/content";
import type { Service } from "@/content/schema";
import { testimonials } from "@/content/testimonials";
import { Breadcrumbs, Faqs, LinkList, pathItems } from "./parts";

// Each approved quote is about one kind of job, so it appears only on that service (no repeated paragraphs).
const QUOTE_FOR: Record<string, string> = { "malware-removal": "DEN", "care-plans": "HostingAdvice" };

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-20">
      <h2 id={id} className={h2}>
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/**
 * Service page (/<hub>/<service>/). Layout family: document column with a sticky conversion rail (lg).
 * Hero is stacked (text, then the frame), not the home asymmetric split. Under 768px the global bottom bar is the
 * only rail. Primary CTA follows the SITEMAP node intent.
 */
export function ServiceTemplate({ service: s }: { service: Service }) {
  const intent = primaryCtaFor(s.intent);
  const loc = `service:${s.id}`;
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;
  const quoteOrg = QUOTE_FOR[s.id];
  const quote = brand.legacy.enabled && quoteOrg ? testimonials.find((t) => t.org.startsWith(quoteOrg)) : undefined;

  return (
    <>
      <JsonLd data={[serviceLd(s), faqLd(s.faqs)]} />
      <div className={pageWrap}>
        <Breadcrumbs items={nodeCrumbs(s.path)} />

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <article data-intent={s.intent} className="min-w-0">
            <header className="pt-8 md:pt-12">
              <h1 className={h1}>{s.h1}</h1>
              <p className={`mt-5 ${lead}`}>{s.heroLine}</p>
              <div className="mt-8">
                <CtaPair intent={intent} location={`${loc}:hero`} service={s.id} hero />
              </div>
              <BrowserFrame slot={s.image.slot} alt={s.image.alt} url="https://example.com/wp-admin/" className="mt-12" preload />
            </header>

            {s.intent === "fix" ? (
              <Section id="symptoms" title="Does your site show this?">
                <ul className="space-y-3">
                  {s.symptoms.map((x) => (
                    <li key={x} className="flex gap-3 text-[16px] leading-relaxed text-text">
                      <Check size={20} aria-hidden className="mt-0.5 shrink-0 text-accent-ink" />
                      {x}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : (
              <Section id="who" title="Who this is for">
                <p className={body}>{s.whoItsFor}</p>
              </Section>
            )}

            <Section id="what-we-do" title="What we do">
              <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {s.whatWeDo.map((w) => (
                  <div key={w.verb}>
                    <dt className="font-mono text-[13px] text-accent-ink">{w.verb}</dt>
                    <dd className="mt-2 text-[16px] leading-relaxed text-text">{w.detail}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <Section id="deliverables" title="What you get">
              <ul className="grid gap-3">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-3 rounded-card border border-line bg-surface px-5 py-4 text-[16px] leading-relaxed text-text">
                    <Check size={20} aria-hidden className="mt-0.5 shrink-0 text-muted" />
                    {d}
                  </li>
                ))}
              </ul>
            </Section>

            {s.guideSlugs.length > 0 && (
              <Section id="errors" title="Errors we fix here">
                <LinkList
                  items={s.guideSlugs.map((slug) => {
                    const g = getGuide(slug)!;
                    return { href: routes.guide(slug), title: g.title, meta: g.errorText };
                  })}
                />
              </Section>
            )}

            {quote && (
              <figure className="mt-20 border-l-2 border-accent pl-6">
                <blockquote className="max-w-[60ch] text-[18px] leading-relaxed text-text">
                  {quote.quote.split("\n\n").map((para) => (
                    <p key={para.slice(0, 24)} className="mt-3 first:mt-0">
                      &ldquo;{para}&rdquo;
                    </p>
                  ))}
                </blockquote>
                <figcaption className="mt-4 text-[15px] text-muted">
                  {quote.name}, {"role" in quote && quote.role ? `${quote.role}, ` : ""}
                  {quote.org}
                </figcaption>
              </figure>
            )}

            <Faqs faqs={s.faqs} />

            {s.relatedPaths.length > 0 && (
              <Section id="related" title="Related services">
                <LinkList items={pathItems(s.relatedPaths)} />
              </Section>
            )}
          </article>

          {/* Conversion rail, lg only. Turnaround and price render only when the owner has supplied them. */}
          <aside aria-label="Book this service" className="hidden lg:block">
            <div className="sticky top-24 mt-12 rounded-card border border-line bg-surface p-6 shadow-card">
              <p className="text-lg font-semibold tracking-tight text-text">{s.title}</p>
              {(s.typicalTurnaround || s.priceFrom) && (
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[13px]">
                  {s.typicalTurnaround && (
                    <>
                      <dt className="text-muted">turnaround</dt>
                      <dd className="text-text">{s.typicalTurnaround}</dd>
                    </>
                  )}
                  {s.priceFrom && (
                    <>
                      <dt className="text-muted">from</dt>
                      <dd className="text-text">{s.priceFrom}</dd>
                    </>
                  )}
                </dl>
              )}
              <div className="mt-6 grid gap-2">
                <Primary location={`${loc}:rail`} service={s.id} className="w-full" />
                <ChatButton location={`${loc}:rail`} service={s.id} className="w-full" />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CtaBand line={s.seo.description}>
        <CtaPair intent={intent} location={`${loc}:band`} service={s.id} />
      </CtaBand>
    </>
  );
}

