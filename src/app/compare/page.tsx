import type { Metadata } from "next";
import Link from "next/link";
import { nodeCrumbs } from "@/components/JsonLd";
import { Band, BandTitle, Breadcrumbs, CtaBand } from "@/components/templates/parts";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import { compares } from "@/content";

export const metadata: Metadata = {
  title: "WordPress Comparisons",
  description: "Neutral side-by-side comparisons: WordPress or Wix, WooCommerce or Shopify, a care plan or pay-as-you-go support.",
  alternates: { canonical: routes.compares },
  openGraph: { title: "WordPress Comparisons", url: routes.compares, type: "website" },
};

export default function CompareIndex() {
  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(routes.compares)} />
        <h1 className="mt-8 max-w-[18ch] text-[clamp(2rem,4.2vw,3.25rem)]">Comparisons</h1>
        <p className="mt-6 max-w-[54ch] text-lg text-muted">
          Factual side-by-side writeups, verdict first. We are not one of the options being compared.
        </p>
      </div>

      <Band labelledBy="compare-list">
        <BandTitle id="compare-list">Side by side</BandTitle>
        <ul className="mt-8">
          {compares.map((c) => (
            <li key={c.slug} className="border-t border-line">
              <Link href={routes.compare(c.slug)} className="group grid gap-2 py-6 md:grid-cols-[24rem_1fr] md:gap-8">
                <span className="font-bold transition-colors duration-200 group-hover:text-accent-text">
                  {c.a} vs {c.b}
                </span>
                <span className="max-w-[60ch] text-[0.9375rem] text-muted">{c.seo.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <CtaBand
        intent={primaryCtaFor(nodeByPath.get(routes.compares)?.intent)}
        location="compare-index"
        title="Still deciding? Talk it through with an engineer."
      />
    </article>
  );
}
