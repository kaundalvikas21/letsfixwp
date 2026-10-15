import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { hasScreen, Photo } from "@/components/Photo";
import { SiteStatus } from "@/components/SiteStatus";
import { primaryCtaFor } from "@/config/cta";
import { routes } from "@/config/routes";
import { getGuide } from "@/content";
import { testimonials } from "@/content/testimonials";
import { servicePhotos } from "@/content/photos";
import type { Service } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, Faqs, h1, h2, LinkList, LinkRows, page, RealScreen, Section, TickList } from "./parts";

const Primary = ({ intent, ...rest }: { intent: ReturnType<typeof primaryCtaFor>; location: string; service: string; className?: string }) =>
  intent === "PLANS" ? <PlansLink {...rest} /> : intent === "QUOTE" ? <QuoteLink {...rest} /> : <BookLink {...rest} />;

/**
 * /<hub>/<service>/. Layout family: lead column with a sticky conversion rail (lg), which no home section uses.
 * Hero carries no subtext: the shortest line in the content is 25+ words, over the contract's 20-word hero cap,
 * so service.summary renders as the lead paragraph under the hero instead.
 */
export function ServiceTemplate({ service: s }: { service: Service }) {
  const intent = primaryCtaFor(s.intent);
  const loc = `service:${s.id}`;
  const guides = s.guideSlugs.map((slug) => getGuide(slug)!).filter(Boolean);
  // The first of this service's guides whose capture has actually been written.
  const capture = guides.find((g) => hasScreen(`/screens/${g.image.slot}.png`));
  // One quote, and only a real one: placeholders belong on the home page where they are marked as
  // such, never on a service page where they would read as a client's words (src/content/testimonials.ts).
  const quote = testimonials.find((t) => !("placeholder" in t && t.placeholder));
  const facts = [
    s.typicalTurnaround && { k: "Typical turnaround", v: s.typicalTurnaround },
    s.priceFrom && { k: "From", v: s.priceFrom },
  ].filter((x): x is { k: string; v: string } => !!x);

  return (
    <article data-intent={s.intent} className={cn(page, "py-8 md:py-12")}>
      <JsonLd data={[serviceLd(s), faqLd(s.faqs)]} />
      <Breadcrumbs items={nodeCrumbs(s.path)} />

      <header className="mt-6 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className={h1}>{s.h1}</h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Primary intent={intent} location={`${loc}:hero`} service={s.id} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} service={s.id} className="btn-secondary" />
          </div>
          {s.intent === "fix" && <SiteStatus />}
        </div>
        <div className="lg:col-span-5">
          {/* A real capture of one of this service's own errors when one exists, the service's night
              frame until then (contract rule 7, docs/image-todo.md). */}
          {capture ? (
            <RealScreen slot={capture.image.slot} alt={capture.image.alt} preload />
          ) : (
            <div className="aspect-[4/3] overflow-hidden rounded-[14px]">
              <Photo id={servicePhotos[s.id]} decorative preload sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          )}
        </div>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <p className="max-w-[68ch] font-display text-xl leading-snug font-bold md:text-2xl">{s.summary}</p>

          {s.intent === "fix" ? (
            <Section id="symptoms" title="Does your site show this?">
              <TickList items={s.symptoms} />
            </Section>
          ) : (
            <Section id="who" title="Who this is for">
              <p className="max-w-[68ch] text-muted">{s.whoItsFor}</p>
            </Section>
          )}

          <Section id="what-we-do" title="What we do">
            <ol className="grid gap-4 sm:grid-cols-2">
              {s.whatWeDo.map((w) => (
                <li key={w.verb} className="rounded-[14px] border border-line bg-surface p-5">
                  <span className="font-display text-sm font-bold tracking-wide text-accent-text">{w.verb}</span>
                  <p className="mt-1.5 text-sm">{w.detail}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="deliverables" title="What you get">
            <TickList items={s.deliverables} cols={2} />
          </Section>

          {guides.length > 0 && (
            <Section id="guides" title="Errors we fix here">
              <LinkRows items={guides.map((g) => ({ href: routes.guide(g.slug), title: g.title, summary: g.symptoms[0] }))} />
            </Section>
          )}

          {quote && (
            <Section id="quote" title="In a client's words">
              <figure className="rounded-[14px] border border-line bg-surface p-6">
                <blockquote className="font-display text-lg leading-snug font-bold md:text-xl">
                  &ldquo;{quote.excerpt}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-[15px]">
                  <span className="font-semibold">{quote.name}</span>
                  <span className="text-muted">
                    , {quote.role}, {quote.org}
                  </span>
                </figcaption>
              </figure>
            </Section>
          )}

          <Faqs faqs={s.faqs} />

          {s.relatedPaths.length > 0 && (
            <Section id="related" title="Related">
              <LinkList paths={s.relatedPaths} />
            </Section>
          )}
        </div>

        {/* Conversion rail: sticky from lg. Under 768px the global bottom bar is the only persistent CTA. */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-28 rounded-[14px] border border-line bg-surface p-6 shadow-card">
            <p className="font-display text-lg font-bold">{s.title}</p>
            {facts.length > 0 && (
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                {facts.map((f) => (
                  <div key={f.k} className="flex justify-between gap-4">
                    <dt className="text-muted">{f.k}</dt>
                    <dd className="font-semibold">{f.v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-5 grid gap-2">
              <Primary intent={intent} location={`${loc}:rail`} service={s.id} className="btn-primary w-full" />
              <ChatButton location={`${loc}:rail`} service={s.id} className="btn-secondary w-full" />
            </div>
          </div>
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
