import type { Metadata } from "next";
import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/templates/parts";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import { compares } from "@/content";

export const metadata: Metadata = {
  title: "WordPress Comparisons",
  description: "Neutral side-by-side comparisons: WordPress or Wix, WooCommerce or Shopify, a care plan or pay-as-you-go support.",
  alternates: { canonical: routes.compares },
};

export default function CompareIndex() {
  return (
    <>
      <Breadcrumbs items={nodeCrumbs(routes.compares)} />
      <h1>Comparisons</h1>
      <ul>
        {compares.map((c) => (
          <li key={c.slug}>
            <Link href={routes.compare(c.slug)}>
              {c.a} vs {c.b}
            </Link>
          </li>
        ))}
      </ul>
      <CtaPair intent={primaryCtaFor(nodeByPath.get(routes.compares)?.intent)} location="compare-index" />
    </>
  );
}
