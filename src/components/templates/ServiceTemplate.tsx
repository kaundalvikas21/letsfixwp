import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { SiteStatus } from "@/components/SiteStatus";
import { CLOSING_ASK, primaryCtaFor } from "@/config/cta";
import { getGuide } from "@/content";
import { testimonials } from "@/content/testimonials";
import { verbIcon } from "@/content/icons";
import { servicePhotos } from "@/content/photos";
import type { Service } from "@/content/schema";
import { cn } from "@/lib/utils";
import { ReadingRail } from "./ReadingRail";
import { Breadcrumbs, ClosingBand, ErrorCards, Faqs, LinkList, PageMasthead, Section, TickList, page, pageY } from "./parts";

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
  // One quote, and only a real one: placeholders belong on the home page where they are marked as
  // such, never on a service page where they would read as a client's words (src/content/testimonials.ts).
  const quote = testimonials.find((t) => !("placeholder" in t && t.placeholder));
  const facts = [
    s.typicalTurnaround && { k: "Typical turnaround", v: s.typicalTurnaround },
    s.priceFrom && { k: "From", v: s.priceFrom },
  ].filter((x): x is { k: string; v: string } => !!x);

  return (
    <div data-intent={s.intent} className={cn(page, pageY)}>
      <JsonLd data={[serviceLd(s), faqLd(s.faqs)]} />
      <Breadcrumbs items={nodeCrumbs(s.path)} />

      {/* The 7/5 split is gone: the service's night frame is the band now, not a picture in the
          right-hand five columns. No lead inside it, which is the same reason the old header had no
          subtext, the shortest line in the content is 25+ words and the hero cap is 20, so
          service.summary still renders as the lead paragraph below. */}
      <PageMasthead
        photo={servicePhotos[s.id]}
        title={s.h1}
        actions={
          <>
            <Primary intent={intent} location={`${loc}:hero`} service={s.id} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} service={s.id} className="btn-secondary" />
          </>
        }
      />
      {s.intent === "fix" && <SiteStatus />}

      {/* No capture under the band. It used to sit here, on the four services whose errors have a
          screenshot written, and it read as a second banner on a page whose banner is the band. The
          guide this service links to carries the same shot, in its "What you are seeing" section,
          which is where a picture of an error belongs and where a reader who wants to recognise
          their screen is already going. */}

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-rail-scope className="lg:col-span-8">
          <p
            className="rise-in max-w-[68ch] font-display text-xl leading-snug font-bold [font-variation-settings:'opsz'_20] md:text-2xl md:[font-variation-settings:'opsz'_24]"
            style={{ animationDelay: "140ms" }}
          >
            {s.summary}
          </p>

          {s.intent === "fix" ? (
            <Section id="symptoms" title="Does your site show this?">
              <TickList items={s.symptoms} />
            </Section>
          ) : (
            <Section id="who" title="Who this is for">
              <p className="reveal-self max-w-[68ch] text-muted">{s.whoItsFor}</p>
            </Section>
          )}

          <Section id="what-we-do" title="What we do">
            <ol className="reveal grid gap-4 sm:grid-cols-2">
              {s.whatWeDo.map((w, i) => (
                <li
                  key={w.verb}
                  className={cn(
                    "rounded-[14px] border border-line bg-surface p-5",
                    // whatWeDo holds 3 to 5 steps, so an odd count leaves the last one alone in a
                    // two-up grid with a hole beside it. Letting it run the full width reads as the
                    // closing step rather than as a tile the layout forgot.
                    s.whatWeDo.length % 2 === 1 && i === s.whatWeDo.length - 1 && "sm:col-span-2",
                  )}
                >
                  {/* The verb already carries the step; the mark lets the four be told apart at a
                      glance instead of read in sequence. Keyed off `w.verb` through one map, so the
                      same verb is the same mark on all 32 service pages. */}
                  {(() => {
                    const Mark = verbIcon[w.verb as keyof typeof verbIcon];
                    return <Mark weight="duotone" aria-hidden className="size-5 text-accent-text" />;
                  })()}
                  <span className="mt-3 block font-display text-sm font-bold tracking-wide text-accent-text">{w.verb}</span>
                  <p className="mt-1.5 text-sm">{w.detail}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="deliverables" title="What you get">
            <TickList items={s.deliverables} cols={2} />
          </Section>

          {quote && (
            <Section id="quote" title="In a client's words">
              <figure className="reveal-self rounded-[14px] border border-line bg-surface p-6">
                <blockquote className="font-display text-lg leading-snug font-bold [font-variation-settings:'opsz'_18] md:text-xl md:[font-variation-settings:'opsz'_20]">
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
            {/* Last child, so the card grows downward into the empty column and nothing above it
                moves when it mounts. */}
            <ReadingRail />
          </div>
        </aside>
      </div>

      {/* Outside the reading column on purpose, and it is the one section on this page that is.
          Two reasons, and they point the same way. The page already spends a 2-up grid on "What we
          do", so a second 2-up inside the same eight columns would be the same layout family twice
          (contract rule 3); on the full spine, four across, this is a different thing. And four
          cards in an eight-column well would be 160px wide, which is narrower than the error
          strings they carry. The h2 still starts on the page's one left edge, so the break-out
          costs the reading rhythm nothing.

          Each card is an error, so each card's mark is the error's own urgency and its own literal
          string, not a picture of a desk. */}
      {guides.length > 0 && (
        <Section id="guides" title="Errors we fix here">
          <ErrorCards guides={guides} />
        </Section>
      )}

      {/* Closing band: split, not a centred panel, so it does not repeat the home page's final CTA family. */}
      {/* `s.title` before this, so the band read "WordPress emergency fix" beside two buttons: the
          service's own name used as a heading, which labels the block instead of asking the reader
          anything. The question follows the page's intent, the same field that already chooses the
          primary button. */}
      <ClosingBand
        title={CLOSING_ASK[intent]}
        actions={
          <>
            <Primary intent={intent} location={`${loc}:closing`} service={s.id} className="btn-primary" />
            <ChatButton location={`${loc}:closing`} service={s.id} className="btn-secondary" />
          </>
        }
      />
    </div>
  );
}
