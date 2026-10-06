import Image from "next/image";
import { BookLink, ChatButton } from "@/components/Cta";
import { getProblem, problemPath, problems } from "@/content/problems";
import { site } from "@/content/site";
import { TriageConsole, type TriageChip, type TriageProblem } from "./TriageConsole";

const chips: TriageChip[] = [
  { label: "White screen", slug: "white-screen-of-death" },
  { label: "Critical error", slug: "critical-error-on-this-website" },
  { label: "Hacked", slug: "hacked" },
  { label: "Database error", slug: "error-establishing-database-connection" },
  { label: "Locked out", slug: "locked-out-of-wp-admin" },
  { label: "Checkout broken", slug: "woocommerce-checkout-not-working" },
];
for (const c of chips) if (!getProblem(c.slug)) throw new Error(`Hero chip points at unknown problem "${c.slug}"`);

const triageProblems: TriageProblem[] = problems.map((p) => ({
  slug: p.slug,
  title: p.title,
  h1: p.h1,
  symptoms: p.symptoms,
  urgency: p.urgency,
  typicalTurnaround: p.typicalTurnaround,
  priceFrom: p.priceFrom,
  path: problemPath(p),
  causes: p.likelyCauses.slice(0, 2),
}));

/**
 * Asymmetric split, 5/7 at lg. One grid, explicit placement:
 *   lg:      [h1 | console] / [subtext | console] / [CTAs | console]
 *   < lg:    h1, console, subtext, CTAs stacked in DOM order (console first below the headline).
 * Sits under the transparent nav (-mt-16), so pt-24 leaves 32px below the bar.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate -mt-16 overflow-hidden">
      <div className="mx-auto grid min-h-[100dvh] max-w-7xl content-start gap-x-12 gap-y-8 px-4 pt-24 pb-16 md:px-6 lg:grid-cols-12 lg:grid-rows-[1fr_auto_1fr] lg:content-center">
        {/* Font sizes to its own column: the widest line is 9.055em, so 100cqi / 9.3 keeps it to exactly 2 lines. */}
        <div className="@container lg:col-span-5 lg:row-start-1 lg:self-end">
          <h1
            id="hero-title"
            className="text-[min(3.75rem,calc(100cqi/9.3))] leading-[1.05] font-semibold tracking-tight text-text"
          >
            <span className="block">WordPress broken?</span>
            <span className="block">Get it fixed today.</span>
          </h1>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6 lg:row-span-3 lg:row-start-1 lg:self-center">
          {/* Dim photo behind the console; edges fade into --bg so the console stays the focal point. */}
          <div aria-hidden className="pointer-events-none absolute -inset-x-4 -inset-y-12 -z-10 md:-inset-x-10 lg:-inset-y-24">
            <Image
              src="https://picsum.photos/seed/fixmywp-hero-1/1600/1200"
              alt=""
              fill
              preload
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/20 to-bg/60" />
            <div className="absolute inset-0 bg-linear-to-b from-bg via-transparent to-bg" />
          </div>
          <TriageConsole problems={triageProblems} chips={chips} />
        </div>

        <p className="max-w-[44ch] text-lg leading-relaxed text-muted lg:col-span-5 lg:row-start-2">
          Tell us what you see. A senior WordPress engineer diagnoses it, fixes it, and backs it with a{" "}
          {site.guaranteeDays}-day guarantee.
        </p>

        <div data-hero-cta className="flex flex-wrap gap-2 lg:col-span-5 lg:row-start-3 lg:self-start">
          <BookLink location="home:hero" />
          <ChatButton location="home:hero" />
        </div>
      </div>
    </section>
  );
}
