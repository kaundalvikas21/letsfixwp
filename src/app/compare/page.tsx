import type { Metadata } from "next";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { CtaBand, h1, lead, pageWrap } from "@/components/sections/v1/page-kit";
import { Breadcrumbs, LinkList } from "@/components/templates/parts";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import { compares } from "@/content";

export const metadata: Metadata = {
  title: "WordPress Comparisons",
  description: "Neutral side-by-side comparisons: WordPress or Wix, WooCommerce or Shopify, a care plan or pay-as-you-go support.",
  alternates: { canonical: routes.compares },
};

/** Comparisons index. Layout family: plain directory list, deliberately quieter than the guides grid. */
export default function CompareIndex() {
  const intent = primaryCtaFor(nodeByPath.get(routes.compares)?.intent);
  return (
    <>
      <div className={pageWrap}>
        <Breadcrumbs items={nodeCrumbs(routes.compares)} />
        <header className="pt-8 md:pt-12">
          <h1 className={h1}>Comparisons</h1>
          <p className={`mt-5 ${lead}`}>
            Factual side-by-side answers, with the verdict for each situation before the detail.
          </p>
        </header>
        <div className="mt-12 max-w-[47.5rem]">
          <LinkList items={compares.map((c) => ({ href: routes.compare(c.slug), title: `${c.a} vs ${c.b}`, meta: c.seo.description }))} />
        </div>
      </div>
      <CtaBand line="Still weighing it up? An engineer can talk through your case.">
        <CtaPair intent={intent} location="compare-index" />
      </CtaBand>
    </>
  );
}
