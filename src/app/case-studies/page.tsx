import type { Metadata } from "next";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Write-ups of WordPress sites we have repaired, secured and built.",
  alternates: { canonical: routes.reviews },
};

export default function CaseStudies() {
  // The only approved quotes belong to the fixmywp.com business, so they show only when legacy is enabled.
  const quotes = brand.legacy.enabled ? testimonials : [];
  return (
    <>
      <Breadcrumbs items={nodeCrumbs(routes.reviews)} />
      <h1>Case studies</h1>
      {quotes.length ? (
        quotes.map((t) => (
          <figure key={t.name}>
            <blockquote>
              {t.quote.split("\n\n").map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </blockquote>
            <figcaption>
              {t.name}, {t.org}
            </figcaption>
          </figure>
        ))
      ) : (
        <p>No case studies are published yet. We add them once clients approve the write-up.</p>
      )}
      <CtaPair intent={primaryCtaFor(nodeByPath.get(routes.reviews)?.intent)} location="case-studies" />
    </>
  );
}
