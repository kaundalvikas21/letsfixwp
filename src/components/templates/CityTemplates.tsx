import Link from "next/link";
import { ChatButton, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { routes, type FlatNode } from "@/config/routes";
import { cities, getService } from "@/content";
import { servicePhotos } from "@/content/photos";
import { deliveryIcon } from "@/content/icons";
import { citiesLead, remoteDelivery } from "@/content/notices";
import type { City } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, ClosingBand, Faqs, LinkCards, PageMasthead, Section, page, pageY } from "./parts";

/** /wordpress-development/cities/: every city, in build priority order. */
export function CityHubTemplate({ node }: { node: FlatNode }) {
  return (
    <article className={cn(page, pageY, "max-w-4xl")}>
      <Breadcrumbs items={nodeCrumbs(node.path)} />
      {/* A bare h1 with a sentence under it before this, the one inner page with no header box at
          all. `racks` is a mono frame, which is what a page that names fourteen cities and favours
          none of them can carry: the work is remote, so no city gets a photograph of itself. */}
      <PageMasthead
        photo="racks"
        title="WordPress development by city"
        lead={citiesLead}
        actions={
          <>
            <QuoteLink location="city-hub" className="btn-primary" />
            <ChatButton location="city-hub" className="btn-secondary" />
          </>
        }
      />
      <div className="mt-8">
        {/* Two across, not four: this article is capped at max-w-4xl, where four columns leave 212px
            for titles that all begin "WordPress development in". The spine pages take the 4-up. */}
        <LinkCards items={cities.map((c) => ({ href: routes.city(c.slug), title: `WordPress development in ${c.city}`, summary: c.seo.description }))} />
      </div>
      {/* This page ended on the last city in the directory and said nothing after it. Its CTA pair
          moved onto the band in Task 10, which was right for the opening and left the foot of a
          fourteen-row list with no way out. The band every other reading page closes on. */}
      <ClosingBand
        title="Want a quote for your project?"
        actions={
          <>
            <QuoteLink location="city-hub:closing" className="btn-primary" />
            <ChatButton location="city-hub:closing" className="btn-secondary" />
          </>
        }
      />
    </article>
  );
}

/**
 * /wordpress-development/cities/<slug>/. Layout family: local prose column with a service panel and a remote
 * delivery strip. Service JSON-LD with areaServed; no LocalBusiness, because there is no office in the city.
 */
export function CityTemplate({ city: c, node }: { city: City; node: FlatNode }) {
  const highlighted = c.servicesHighlighted.map((id) => getService(id)!);
  const dev = getService("website-design")!;
  const path = routes.city(c.slug);
  const loc = `city:${c.slug}`;

  return (
    <article className={cn(page, pageY, "max-w-4xl")}>
      <JsonLd
        data={[
          serviceLd(dev, {
            name: `WordPress development in ${c.city}`,
            url: path,
            areaServed: { "@type": "City", name: c.city, containedInPlace: { "@type": "Country", name: "India" } },
          }),
          faqLd(c.faqs),
        ]}
      />
      <Breadcrumbs items={nodeCrumbs(node.path)} />

      {/* The frame comes from the first service this city asks for, which is the nearest honest
          mapping the catalogue offers: there is no office in the city and no photograph of it, so
          the band shows the work rather than the place. No lead inside it, because the local context
          paragraphs below are this page's lead and the hero cap is 20 words. */}
      <PageMasthead
        photo={servicePhotos[highlighted[0].id]}
        title={`WordPress development in ${c.city}`}
        actions={
          <>
            <QuoteLink location={`${loc}:hero`} service={highlighted[0]?.id} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} service={highlighted[0]?.id} className="btn-secondary" />
          </>
        }
      />

      <div className="mt-10 space-y-5">
        {c.localContext.map((p) => (
          <p key={p.slice(0, 32)} className="max-w-[68ch] text-muted">
            {p}
          </p>
        ))}
      </div>

      <Section id="services" title={`What ${c.city} clients ask for`}>
        <LinkCards items={highlighted.map((s) => ({ href: s.path, title: s.title, summary: s.summary }))} />
      </Section>

      <Section id="remote" title="How working with us runs">
        <dl className="grid gap-4 sm:grid-cols-3">
          {remoteDelivery.map((r) => (
            <div key={r.label} className="rounded-[14px] border border-line bg-surface p-5">
              {/* The about page runs these same three entries down a rail, where a short ember tick
                  is each one's mark. Here they are cards with nothing to mark them, so the mark is
                  the icon. (Route written as prose, not as a path: `scripts/check-content.ts` reads
                  a slash-wrapped path in a comment as a hardcoded link and fails the build on it.) */}
              <dt className="font-display text-sm font-bold tracking-wide text-accent-text">
                {(() => {
                  const Mark = deliveryIcon[r.label as keyof typeof deliveryIcon];
                  return <Mark weight="duotone" aria-hidden className="mb-3 size-5" />;
                })()}
                {r.label}
              </dt>
              <dd className="mt-1.5 text-sm">{r.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Faqs faqs={c.faqs} />

      <ClosingBand
        title={`Want a WordPress team for ${c.city}?`}
        actions={
          <>
            <QuoteLink location={`${loc}:closing`} service={highlighted[0]?.id} className="btn-primary" />
            <ChatButton location={`${loc}:closing`} service={highlighted[0]?.id} className="btn-secondary" />
          </>
        }
      />

      <p className="mt-8 text-sm text-muted">
        <Link href={routes.cities} className="underline underline-offset-4 hover:no-underline">
          Other cities we work with
        </Link>
      </p>
    </article>
  );
}
