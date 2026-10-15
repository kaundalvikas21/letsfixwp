import { CheckIcon } from "@phosphor-icons/react/ssr";
import { BookLink, PlansLink } from "@/components/Cta";
import { Photo } from "@/components/Photo";
import { brand } from "@/config/brand";
import { getService } from "@/content";
import type { PhotoId } from "@/content/photos";
import { formatPrice, prices, type Price } from "@/content/pricing";
import { ExpandingRows, type Row } from "./ExpandingRows";

// A price renders only once the owner publishes it (src/content/pricing.ts: every price is null today,
// and contract rule 8 says a null value renders nothing, not a placeholder number).
const from = (p: Price | null, unit: string) =>
  p && (
    <span className="whitespace-nowrap">
      <span className="font-display text-2xl font-extrabold">From {formatPrice(p)}</span>{" "}
      <span className="text-muted">{unit}</span>
    </span>
  );

const shot = (id: PhotoId) => (
  <div className="aspect-[16/10] overflow-hidden rounded-[14px]">
    <Photo id={id} decorative sizes="(min-width: 768px) 30vw, 92vw" />
  </div>
);

// Inclusions are deliverables from the content files, so no row states anything the service pages do not.
// The care plan's free fix, and the value put on it, belong to the old fixmywp.com business
// (brand.legacy.facts.freeFixValue): they appear only if the owner ever turns legacy facts on, and
// nothing in their place while it is off.
const freeFix = brand.legacy.facts && `A fix included each month, worth ${brand.legacy.facts.freeFixValue}`;

const ROWS: Row[] = [
  {
    name: "One-time fix",
    who: "One problem on your site, found and fixed.",
    price: from(prices.fix, "per fix"),
    items: getService("emergency")!.deliverables.slice(0, 5),
    image: shot("emergency"),
    cta: <BookLink location="home:plans" className="btn-primary" />,
  },
  {
    name: "Hacked site cleanup",
    who: "Malware out, the way in closed.",
    price: from(prices.cleanup, "per site"),
    items: getService("malware-removal")!.deliverables.slice(0, 5),
    image: shot("cables"),
    cta: <BookLink location="home:plans" service="malware-removal" className="btn-primary" />,
  },
  {
    name: "Care plan",
    who: "Updates, backups and monitoring, every month.",
    price: from(prices.planMonthly, "a month"),
    items: [...getService("care-plans")!.deliverables.slice(0, 4), ...(freeFix ? [freeFix] : [])],
    image: shot("racks"),
    cta: <PlansLink location="home:plans" className="btn-primary" />,
  },
];

/** Three ways to work with us, one row open at a time. */
export function Plans() {
  return (
    <section aria-labelledby="plans" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <h2
        id="plans"
        className="font-display text-[1.875rem] leading-[1.1] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_30] sm:text-5xl sm:[font-variation-settings:'opsz'_48]"
      >
        Choose how you want help
      </h2>
      <ExpandingRows
        rows={ROWS}
        checkIcon={<CheckIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />}
      />
    </section>
  );
}
