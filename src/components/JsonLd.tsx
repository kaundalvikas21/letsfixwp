import { bookHref } from "@/config/cta";
import { problemPath } from "@/content/problems";
import type { Problem } from "@/content/schema";
import { site } from "@/content/site";

type Thing = Record<string, unknown>;

export function JsonLd({ data }: { data: Thing | Thing[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const ORG_ID = `${site.url}/#organization`;

export const organizationLd = (): Thing => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.name,
  url: site.url,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.email },
});

export const breadcrumbLd = (items: { name: string; path: string }[]): Thing => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${site.url}${it.path}`,
  })),
});

export const faqLd = (faqs: { q: string; a: string }[]): Thing => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const problemLd = (p: Problem): Thing[] => {
  const offer: Thing = { "@type": "Offer", url: `${site.url}${bookHref(p.slug)}` };
  if (p.priceFrom) {
    offer.price = p.priceFrom.replace(/[^0-9.]/g, "");
    offer.priceCurrency = "USD";
  }
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: p.title,
      serviceType: p.title,
      description: p.seo.description,
      url: `${site.url}${problemPath(p)}`,
      provider: { "@id": ORG_ID },
      offers: offer,
    },
    faqLd(p.faqs),
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "WordPress problems", path: "/fix" },
      { name: p.title, path: problemPath(p) },
    ]),
  ];
};
