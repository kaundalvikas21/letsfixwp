import { Check } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { BookLink, CheckLink, PlansLink } from "@/components/Cta";
import { brand } from "@/config/brand";
import { getService } from "@/content";

const Confirm = () => <span className="ml-1 font-mono text-[14px] font-normal text-muted">{"{{CONFIRM}}"}</span>;

const currencyCode = brand.currency === "USD" ? "USD" : "INR"; // "both" leads with INR for the Indian market
const symbol = new Intl.NumberFormat("en-IN", { style: "currency", currency: currencyCode })
  .formatToParts(0)
  .find((p) => p.type === "currency")!.value;

/** priceFrom is owner-supplied content: digits are formatted in brand.currency, anything else shows as written. */
const formatPrice = (raw: string) =>
  /^\d+(\.\d+)?$/.test(raw)
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 }).format(Number(raw))
    : raw;

function Price({ priceFrom, fallback }: { priceFrom: string | null; fallback?: ReactNode }) {
  if (priceFrom) return <>From {formatPrice(priceFrom)}</>;
  if (fallback) return <>{fallback}</>;
  return (
    <>
      From {symbol}
      <Confirm />
    </>
  );
}

function Column({
  id,
  title,
  note,
  price,
  cta,
  accent = false,
  badge,
  className = "",
}: {
  id: string;
  title: string;
  note?: string;
  price: ReactNode;
  cta: ReactNode;
  accent?: boolean;
  badge?: string;
  className?: string;
}) {
  const s = getService(id)!;
  return (
    <article
      aria-labelledby={`price-${id}`}
      className={`flex flex-col rounded-card border bg-surface p-6 shadow-card md:p-8 ${accent ? "border-accent" : "border-line"} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 id={`price-${id}`} className="text-xl font-semibold tracking-tight text-text">
          {title}
        </h3>
        {badge && <span className="font-mono text-[12px] text-accent-ink">{badge}</span>}
      </div>
      {note && <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">{note}</p>}
      <p className="mt-6 text-3xl font-semibold tracking-tight text-text">{price}</p>
      {s.typicalTurnaround && <p className="mt-1 font-mono text-[13px] text-muted">turnaround: {s.typicalTurnaround}</p>}
      <ul className="mt-6 space-y-3">
        {s.deliverables.slice(0, 5).map((d) => (
          <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-text">
            <Check size={18} aria-hidden className="mt-0.5 shrink-0 text-muted" />
            {d}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">{cta}</div>
    </article>
  );
}

/**
 * V1.8. Layout family: uneven pricing columns. 1.4fr 1fr 1fr at lg (never three equal cards); at md the emergency
 * tier takes a full row over two columns; under 768px everything stacks with the emergency tier first.
 * Prices come only from service content (priceFrom) and show {{CONFIRM}} until the owner supplies them.
 */
export function PricingColumns() {
  const emergency = getService("emergency")!;
  const hours = getService("support-hours")!;
  const plans = getService("care-plans")!;

  return (
    <section aria-labelledby="pricing" className="border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 id="pricing" className="text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-text">
          Pricing
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <Column
            id="emergency"
            title="Emergency fix"
            accent
            badge={brand.claims.mostBookedEmergency ? "Most booked" : undefined}
            price={
              <Price
                priceFrom={emergency.priceFrom}
                fallback={
                  <>
                    Quote in minutes
                    {!brand.claims.quoteInMinutes && <Confirm />}
                  </>
                }
              />
            }
            cta={<BookLink location="pricing:emergency" service="emergency" className="w-full" />}
            className="md:col-span-2 lg:col-span-1"
          />
          <Column
            id="support-hours"
            title="Support hours"
            note="Pay-as-you-go hour packs for fixes and small changes."
            price={<Price priceFrom={hours.priceFrom} />}
            cta={<PlansLink location="pricing:support-hours" service="support-hours" variant="ghost" className="w-full" />}
          />
          <Column
            id="care-plans"
            title="Care plans"
            note="Basic, Pro and Business. Price shown is Basic; the care plans page compares all three."
            price={<Price priceFrom={plans.priceFrom} />}
            cta={<PlansLink location="pricing:care-plans" service="care-plans" variant="ghost" className="w-full" />}
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-muted">
          <span>Site works, but something about it worries you?</span>
          <CheckLink location="pricing:footer" variant="text" />
        </div>
        {brand.legacy.facts && (
          <p className="mt-3 text-[15px] text-muted">Every fix carries the {brand.legacy.facts.guaranteeDays}-day guarantee.</p>
        )}
      </div>
    </section>
  );
}
