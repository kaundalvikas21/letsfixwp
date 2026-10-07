import { CtaPair } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { body, CtaBand, h1, h2, pageWrap } from "@/components/sections/v1/page-kit";
import { primaryCtaFor } from "@/config/cta";
import { routes, type FlatNode } from "@/config/routes";
import { cities, getService } from "@/content";
import { pageCopy } from "@/content/pages";
import type { City } from "@/content/schema";
import { Breadcrumbs, Faqs, LinkList } from "./parts";

/** /wordpress-development/cities/: every city in build priority order, each with its own description. */
export function CityHubTemplate({ node }: { node: FlatNode }) {
  const intent = primaryCtaFor(node.intent);
  return (
    <>
      <div className={pageWrap}>
        <Breadcrumbs items={nodeCrumbs(node.path)} />
        <header className="pt-8 md:pt-12">
          <h1 className={h1}>{pageCopy.cityHub.h1}</h1>
        </header>
        <div className="mt-12">
          <LinkList items={cities.map((c) => ({ href: routes.city(c.slug), title: c.city, meta: c.seo.description }))} />
        </div>
      </div>
      <CtaBand line={pageCopy.cityHub.band}>
        <CtaPair intent={intent} location="city-hub" />
      </CtaBand>
    </>
  );
}

/**
 * /wordpress-development/cities/<slug>/. Layout family: long-form article with an inline service index.
 * Service JSON-LD with areaServed; never LocalBusiness (no real local address). No offices, clients or reviews.
 */
export function CityTemplate({ city: c, node }: { city: City; node: FlatNode }) {
  const highlighted = c.servicesHighlighted.map((id) => getService(id)!);
  const intent = primaryCtaFor(node.intent);
  const loc = `city:${c.slug}`;

  return (
    <>
      <JsonLd
        data={[
          serviceLd(getService("website-design")!, {
            name: `WordPress development in ${c.city}`,
            url: routes.city(c.slug),
            areaServed: { "@type": "City", name: c.city, containedInPlace: { "@type": "Country", name: "India" } },
          }),
          faqLd(c.faqs),
        ]}
      />
      <div className={pageWrap}>
        <Breadcrumbs items={nodeCrumbs(node.path)} />
        <div className="mx-auto max-w-[47.5rem]">
          <header className="pt-8 md:pt-12">
            <h1 className={h1}>WordPress development in {c.city}</h1>
            <div className="mt-8">
              <CtaPair intent={intent} location={`${loc}:hero`} service={highlighted[0]?.id} hero />
            </div>
          </header>

          <section aria-label={`WordPress for ${c.city} businesses`} className="mt-14 space-y-5">
            {c.localContext.map((p) => (
              <p key={p.slice(0, 32)} className={body}>
                {p}
              </p>
            ))}
          </section>

          <section aria-labelledby="services" className="mt-16">
            <h2 id="services" className={h2}>
              Services {c.city} businesses ask for
            </h2>
            <div className="mt-8">
              <LinkList items={highlighted.map((s) => ({ href: s.path, title: s.title, meta: s.heroLine }))} />
            </div>
          </section>

          <section aria-labelledby="remote" className="mt-16 rounded-card border border-line bg-surface p-6 md:p-8">
            <h2 id="remote" className="text-xl font-semibold tracking-tight text-text">
              How remote delivery works
            </h2>
            <p className={`mt-3 ${body}`}>{c.remoteDelivery}</p>
          </section>

          <Faqs faqs={c.faqs} />
        </div>
      </div>
      <CtaBand line={c.seo.description}>
        <CtaPair intent={intent} location={`${loc}:band`} service={highlighted[0]?.id} />
      </CtaBand>
    </>
  );
}
