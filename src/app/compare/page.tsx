import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, h1, page, Versus } from "@/components/templates/parts";
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
    <div className={cn(page, "py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(routes.compares)} />
      <h1 className={cn(h1, "mt-6")}>Comparisons</h1>
      <p className="mt-5 max-w-[68ch] text-lg text-muted">
        Each one sets out where the two differ and which fits a given scenario. No winner is declared, because it depends on what you are running.
      </p>
      <ul className="mt-8 space-y-4 md:space-y-5">
        {compares.map((c) => (
          <li
            key={c.slug}
            className="group relative grid gap-5 rounded-[20px] border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-lift active:scale-[0.98] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent motion-reduce:transition-none md:grid-cols-[1.1fr_1fr] md:gap-8"
          >
            <div>
              <Versus a={c.a} b={c.b} />
              <h2 className="mt-4 font-display text-xl leading-snug font-bold">
                {/* Stretched link: the whole card is the target; the title is its accessible name. */}
                <Link
                  href={routes.compare(c.slug)}
                  className="inline-flex min-h-11 items-center gap-2 supports-[selector(:has(*))]:outline-none after:absolute after:inset-0 after:rounded-[20px] group-hover:text-accent-text"
                >
                  {c.a} vs {c.b}
                  <CaretRightIcon weight="duotone" className="size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                </Link>
              </h2>
              <p className="mt-2 max-w-[68ch] text-sm text-muted">{c.summary ?? c.seo.description}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Compared on</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                {c.rows.slice(0, 4).map((r) => (
                  <li key={r.criterion}>{r.criterion}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted">
                {c.rows.length} criteria, {c.verdictByScenario.length} scenarios
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap gap-x-3 gap-y-3">
        <BookLink location="compare-index" className="btn-primary" />
        <ChatButton location="compare-index" className="btn-secondary" />
      </div>
    </div>
  );
}
