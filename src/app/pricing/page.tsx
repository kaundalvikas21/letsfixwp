import type { Metadata } from "next";
import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Band, BandTitle, Breadcrumbs } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { hubNodes, routes } from "@/config/routes";
import { services } from "@/content";

export const metadata: Metadata = {
  title: "Pricing",
  description: "WordPress fixes, care plans and projects. Each service shows its starting price once published.",
  alternates: { canonical: routes.pricing },
  openGraph: { title: "Pricing", url: routes.pricing, type: "website" },
};

// A compact index, deliberately not the home page's pricing rows: no per-row CTA, no disclosure, no
// who-it-is-for column. Prices come from src/content/services/*.ts and show only when set (rule 8).
export default function Pricing() {
  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(routes.pricing)} />
        <h1 className="mt-8 max-w-[18ch] text-[clamp(2rem,4.2vw,3.25rem)]">Pricing</h1>
        <p className="mt-6 max-w-[56ch] text-lg text-muted">
          {brand.quoteFlow} Every service below has its own page with scope and inclusions.
        </p>
      </div>

      {hubNodes.map((hub) => {
        const list = services.filter((s) => s.path.startsWith(hub.path));
        if (!list.length) return null;
        return (
          <Band key={hub.path} labelledBy={`p-${hub.path}`}>
            <BandTitle id={`p-${hub.path}`}>{hub.title}</BandTitle>
            <ul className="mt-6 grid gap-px sm:grid-cols-2 sm:gap-x-10">
              {list.map((s) => (
                <li key={s.id} className="border-t border-line">
                  <Link
                    href={s.path}
                    className="flex min-h-11 items-center gap-4 py-3 text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
                  >
                    <span>{s.title}</span>
                    <span className="ml-auto shrink-0 font-mono text-sm text-muted">
                      {s.priceFrom ? `from ${s.priceFrom}` : "On quote"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Band>
        );
      })}

      <Band labelledBy="pricing-cta">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 id="pricing-cta" className="max-w-[24ch] text-[clamp(1.5rem,2.4vw,2rem)]">
            Tell us what is wrong and we will price it.
          </h2>
          <CtaPair intent="BOOK" location="pricing" />
        </div>
      </Band>
    </article>
  );
}
