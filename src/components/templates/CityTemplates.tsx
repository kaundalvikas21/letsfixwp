import { ClosingCta } from "@/components/sections/v3/ClosingCta";
import { Illustration } from "@/components/sections/v3/Photo";
import Link from "next/link";
import { ChatButton, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { routes, type FlatNode } from "@/config/routes";
import { cities, getService } from "@/content";
import { citiesLead, remoteDelivery } from "@/content/notices";
import type { City } from "@/content/schema";
import { bentoLayout } from "@/lib/bento";
import { cn } from "@/lib/utils";
import { Breadcrumbs, Faqs, h1, h2, HeroSplit, LinkRows, page, Section } from "./parts";

// bentoLayout returns 3 for a uniform pair and 2, 4 or 6 otherwise; written out so Tailwind's scanner sees
// every class. A computed `md:col-span-${n}` is never emitted by the v4 scanner.
const SPAN = { 3: "md:col-span-3", 2: "md:col-span-2", 4: "md:col-span-4", 6: "md:col-span-6" } as const;

/** /wordpress-development/cities/: every city, in build priority order. */
export function CityHubTemplate({ node }: { node: FlatNode }) {
  return (
    <article className={cn(page, "max-w-4xl py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(node.path)} />
      <h1 className={cn(h1, "mt-6")}>WordPress development by city</h1>
      <p className="mt-5 max-w-[68ch] text-lg text-muted">
        {citiesLead}
      </p>
      <div className="mt-8">
        <LinkRows items={cities.map((c) => ({ href: routes.city(c.slug), title: `WordPress development in ${c.city}`, summary: c.seo.description }))} />
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <QuoteLink location="city-hub" className="btn-primary" />
        <ChatButton location="city-hub" className="btn-secondary" />
      </div>
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
  const spans = bentoLayout(remoteDelivery.map((r) => r.text.length));

  return (
    <article className={cn(page, "max-w-4xl py-8 md:py-12")}>
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

      <HeroSplit art={<Illustration id="desk-with-laptop" sizes="(min-width: 1024px) 40vw, 100vw" />}>
        <h1 className={h1}>WordPress development in {c.city}</h1>
        <div className="mt-7 flex flex-wrap gap-3">
          <QuoteLink location={`${loc}:hero`} service={highlighted[0]?.id} className="btn-primary" />
          <ChatButton location={`${loc}:hero`} service={highlighted[0]?.id} className="btn-secondary" />
        </div>
      </HeroSplit>

      <div className="mt-10 space-y-5">
        {c.localContext.map((p, i) => (
          <p key={p.slice(0, 32)} data-reveal style={{ "--i": i } as React.CSSProperties} className="max-w-[68ch] text-muted">
            {p}
          </p>
        ))}
      </div>

      <Section id="services" revealBody={false} title={`What ${c.city} clients ask for`}>
        <LinkRows items={highlighted.map((s) => ({ href: s.path, title: s.title, summary: s.summary }))} />
      </Section>

      <Section id="remote" revealBody={false} title="How working with us runs">
        {/* Three items rendered as three equal cards in a row, which contract rule 6 bans outright; /about/ fixed
            the same breach on the same data. Spans now come from `bentoLayout` on the line each card actually
            holds, the weighting the hub grid uses, and the label is a label row rather than part of that line.
            Measured on the real copy the three run 65 to 90 characters, a ratio of 1.38, so the uniform branch
            returns (3,3,6): two a row, which rule 6 allows, and the odd last card spans the row. */}
        <dl className="grid gap-4 md:grid-cols-6 md:gap-5">
          {remoteDelivery.map((r, i) => (
            <div key={r.label} data-reveal style={{ "--i": i } as React.CSSProperties} className={cn("rounded-[20px] border border-line bg-surface p-5", SPAN[spans[i] as keyof typeof SPAN])}>
              <dt className="font-display text-sm font-bold tracking-wide text-accent-text">{r.label}</dt>
              <dd className="mt-1.5 text-sm">{r.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Faqs faqs={c.faqs} />

      <ClosingCta
        id="city-closing"
        title={`Building or fixing a site in ${c.city}?`}
        sub="Tell us what you need and we will scope it, with the meetings on video at a time you pick."
        intent="QUOTE"
        location={`${loc}:closing`}
      />

      <p className="mt-8 text-sm text-muted">
        <Link href={routes.cities} className="underline underline-offset-4 hover:no-underline">
          Other cities we work with
        </Link>
      </p>
    </article>
  );
}
