import { CheckIcon } from "@phosphor-icons/react/ssr";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { BookLink, PlansLink } from "@/components/Cta";
import { getService } from "@/content";
import { annualSaving, formatPrice, prices, type Price } from "@/content/pricing";
const PlanPrice = dynamic(() => import("./PlanPrice").then((m) => m.PlanPrice));

// Inclusions are deliverables from the content files (max 5 each), so nothing here is a new claim.
type Tier = { name: string; who: string; price: ReactNode; items: string[]; cta: ReactNode; featured?: boolean; order: string };

const perFix = (p: Price | null, unit: string) =>
  p && (
    <p>
      <span className="font-display text-4xl font-extrabold">From {formatPrice(p)}</span> <span className="whitespace-nowrap text-muted">{unit}</span>
    </p>
  );

const { planMonthly: m, planAnnual: a } = prices;
const saving = annualSaving(m, a);

// DOM order puts the care plan first (it leads under 768px, where the cards scroll); md:order restores 1-2-3.
const TIERS: Tier[] = [
  {
    name: "Care plan",
    who: "Updates, backups and monitoring, every month.",
    price: m && a ? <PlanPrice monthly={formatPrice(m)} annual={formatPrice(a)} saving={saving && formatPrice(saving)} /> : perFix(m, "a month"),
    items: getService("care-plans")!.deliverables.slice(0, 4),
    cta: <PlansLink location="home:pricing" className="btn-primary w-full" />,
    featured: true,
    order: "md:order-2",
  },
  {
    name: "One-time fix",
    who: "One problem on your site, found and fixed.",
    price: perFix(prices.fix, "per fix"),
    items: getService("emergency")!.deliverables.slice(0, 5),
    cta: <BookLink location="home:pricing" className="btn-secondary w-full" />,
    order: "md:order-1",
  },
  {
    name: "Hacked site cleanup",
    who: "Malware out, the way in closed.",
    price: perFix(prices.cleanup, "per site"),
    items: getService("malware-removal")!.deliverables.slice(0, 5),
    cta: <BookLink location="home:pricing" service="malware-removal" className="btn-secondary w-full" />,
    order: "md:order-3",
  },
];

/** v3 home: three pricing tiers with unequal emphasis; the care plan carries the billing toggle. */
export function Pricing() {
  return (
    <section data-reveal aria-labelledby="pricing" className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-24">
      <h2 id="pricing" className="font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
        Choose how you want help
      </h2>
      <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-2 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:items-center md:gap-6 md:overflow-visible md:px-0">
        {TIERS.map((t) => (
          <li
            key={t.name}
            className={`flex w-[85%] shrink-0 snap-start flex-col rounded-[20px] bg-surface p-6 shadow-card md:w-auto md:p-8 ${t.order} ${
              t.featured ? "z-10 ring-2 ring-accent md:scale-[1.04] md:shadow-lift" : "border border-line"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-2xl font-bold">{t.name}</h3>
              {t.featured && prices.planIsBestValue && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">Best value</span>
              )}
            </div>
            <p className="mt-1 text-muted">{t.who}</p>
            {t.price && <div className="mt-6">{t.price}</div>}
            <ul className="mt-6 space-y-3 text-[15px]">
              {t.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">{t.cta}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
