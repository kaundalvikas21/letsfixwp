import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, LinkRows, page } from "@/components/templates/parts";
import { routes } from "@/config/routes";
import { compares } from "@/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WordPress Comparisons",
  description: "Neutral side-by-side comparisons: WordPress or Wix, WooCommerce or Shopify, a care plan or pay-as-you-go support.",
  alternates: { canonical: routes.compares },
};

export default function CompareIndex() {
  return (
    <div className={cn(page, "max-w-3xl py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.compares)} />
      <h1 className={cn(h1, "mt-6")}>Comparisons</h1>
      <p className="mt-5 max-w-[68ch] text-lg text-muted">
        Each one sets out where the two differ and which fits a given scenario. No winner is declared, because it depends on what you are running.
      </p>
      <div className="mt-8">
        <LinkRows items={compares.map((c) => ({ href: routes.compare(c.slug), title: `${c.a} vs ${c.b}`, summary: c.seo.description }))} />
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <BookLink location="compare-index" className="btn-primary" />
        <ChatButton location="compare-index" className="btn-secondary" />
      </div>
    </div>
  );
}
