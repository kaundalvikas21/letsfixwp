import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { routes, type FlatNode } from "@/config/routes";
import { cities, getService } from "@/content";
import type { City } from "@/content/schema";
import { Breadcrumbs, Faqs } from "./parts";

/** /wordpress-development/cities/: every city, in build priority order. */
export function CityHubTemplate({ node }: { node: FlatNode }) {
  return (
    <article>
      <Breadcrumbs items={nodeCrumbs(node.path)} />
      <h1>WordPress development by city</h1>
      <ul>
        {cities.map((c) => (
          <li key={c.slug}>
            <Link href={routes.city(c.slug)}>{c.seo.title}</Link>
          </li>
        ))}
      </ul>
      <CtaPair intent={primaryCtaFor(node.intent)} location="city-hub" />
    </article>
  );
}

/** /wordpress-development/cities/<slug>/. Service JSON-LD with areaServed; no LocalBusiness (no real local address). */
export function CityTemplate({ city: c, node }: { city: City; node: FlatNode }) {
  const highlighted = c.servicesHighlighted.map((id) => getService(id)!);
  const dev = getService("website-design")!;
  const path = routes.city(c.slug);

  return (
    <article>
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
      <h1>WordPress development for {c.city} businesses</h1>
      {c.localContext.map((p) => (
        <p key={p.slice(0, 32)}>{p}</p>
      ))}
      <CtaPair intent={primaryCtaFor(node.intent)} location={`city:${c.slug}`} service={highlighted[0]?.id} />

      <section aria-labelledby="services">
        <h2 id="services">Services {c.city} clients ask for</h2>
        <ul>
          {highlighted.map((s) => (
            <li key={s.id}>
              <Link href={s.path}>{s.title}</Link>
              <p>{s.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <Faqs faqs={c.faqs} />
    </article>
  );
}
