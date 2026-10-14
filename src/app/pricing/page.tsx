import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink, PlansLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, h2, page, Section } from "@/components/templates/parts";
import { hubIdOf, hubNodes, routes } from "@/config/routes";
import { services } from "@/content";
import { hubLead } from "@/content/hubs";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "WordPress fixes, care plans and projects. Each service shows its starting price once published.",
  alternates: { canonical: routes.pricing },
};

/**
 * Grouped price list, one block per hub. Deliberately not the home page's three-tier card layout: this is the
 * full catalogue. Prices come from each service's priceFrom and render nothing while null (contract rule 8).
 */
export default function Pricing() {
  const priced = services.filter((s) => s.priceFrom).length;

  return (
    <div className={cn(page, "max-w-4xl py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.pricing)} />
      <h1 className={cn(h1, "mt-6")}>Pricing</h1>
      <p className="mt-5 max-w-[68ch] text-lg text-muted">
        {priced > 0
          ? "Every service with a published starting price is listed here. Work is quoted at a fixed price before it starts."
          : "Each fix is quoted at a fixed price before any work starts, once an engineer has seen the problem. Starting prices appear here as each service publishes one."}
      </p>

      {hubNodes.map((hub) => {
        const list = services.filter((s) => s.path.startsWith(hub.path));
        const id = hubIdOf(hub.path);
        return (
          <Section key={hub.path} id={`p-${id}`} title={hub.title}>
            <p className="-mt-1 mb-5 max-w-[68ch] text-sm text-muted">{hubLead[id]}</p>
            <ul className="divide-y divide-line border-y border-line">
              {list.map((s) => (
                <li key={s.id} className="flex items-baseline justify-between gap-6 py-3">
                  <Link href={s.path} className="font-medium hover:text-accent-text">
                    {s.title}
                  </Link>
                  {s.priceFrom && <span className="shrink-0 font-display text-sm font-bold">From {s.priceFrom}</span>}
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      <section aria-labelledby="pricing-closing" className="mt-16 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <h2 id="pricing-closing" className={cn(h2, "max-w-[24ch]")}>
          Get a price for your site
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <BookLink location="pricing" className="btn-primary" />
          <PlansLink location="pricing" className="btn-secondary" />
        </div>
      </section>
      <p className="mt-6 text-sm text-muted">
        Not urgent? <CheckLink location="pricing" /> or <ChatButton location="pricing" />
      </p>
    </div>
  );
}
