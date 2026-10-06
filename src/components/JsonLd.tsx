import { brand } from "@/config/brand";
import { primaryCtaFor } from "@/config/cta";
import { ancestry, routes } from "@/config/routes";
import { SITE_URL } from "@/config/sitemap";
import type { Compare, Guide, Service } from "@/content/schema";

type Thing = Record<string, unknown>;

export function JsonLd({ data }: { data: Thing | Thing[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const ORG_ID = `${SITE_URL}/#organization`;
const abs = (path: string) => `${SITE_URL}${path}`;
const confirmed = (s: string) => !s.includes("{{");

export const organizationLd = (): Thing => {
  const org: Thing = { "@context": "https://schema.org", "@type": "Organization", "@id": ORG_ID, name: brand.name, url: abs("/") };
  if (confirmed(brand.email)) org.email = brand.email;
  const a = brand.legacy.facts?.address; // a real address exists only for the legacy business
  if (a) {
    org.address = {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    };
  }
  return org;
};

export type Crumb = { name: string; path: string };
export const nodeCrumbs = (path: string): Crumb[] => ancestry(path).map((n) => ({ name: n.title, path: n.path }));

export const breadcrumbLd = (items: Crumb[]): Thing => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

export const faqLd = (faqs: { q: string; a: string }[]): Thing => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const ctaHref = (s: Service) => {
  const k = primaryCtaFor(s.intent);
  return k === "PLANS" ? routes.plans(s.id) : k === "QUOTE" ? routes.quote(s.id) : routes.book({ service: s.id });
};

/** Service with an Offer. Price is omitted while null. areaServed for city pages. */
export const serviceLd = (s: Service, opts: { name?: string; url?: string; areaServed?: Thing } = {}): Thing => {
  const offer: Thing = { "@type": "Offer", url: abs(ctaHref(s)) };
  if (s.priceFrom) {
    offer.price = s.priceFrom.replace(/[^0-9.]/g, "");
    offer.priceCurrency = brand.currency === "USD" ? "USD" : "INR";
  }
  const ld: Thing = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name ?? s.title,
    serviceType: s.title,
    description: s.seo.description,
    url: abs(opts.url ?? s.path),
    provider: { "@id": ORG_ID },
    offers: offer,
  };
  if (opts.areaServed) ld.areaServed = opts.areaServed;
  return ld;
};

export const guideLd = (g: Guide): Thing => ({
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: g.title,
  description: g.seo.description,
  url: abs(routes.guide(g.slug)),
  publisher: { "@id": ORG_ID },
  about: "WordPress",
});

export const compareLd = (c: Compare): Thing => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `${c.a} vs ${c.b}`,
  description: c.seo.description,
  url: abs(routes.compare(c.slug)),
  publisher: { "@id": ORG_ID },
});
