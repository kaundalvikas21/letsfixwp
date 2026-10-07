import Image from "next/image";
import { BookLink, ChatButton } from "@/components/Cta";
import { brand } from "@/config/brand";
import { routes } from "@/config/routes";
import { getGuide, getService, guides, matchIndex, services } from "@/content";
import { matchKey } from "@/lib/match-problem";
import { TriageConsole, type TriageChip, type TriageEntry } from "./TriageConsole";

// Quick picks resolve straight to a guide, so they always return the right answer.
const chipGuides: [label: string, guide: string][] = [
  ["White screen", "white-screen-of-death"],
  ["Critical error", "critical-error-on-this-website"],
  ["Hacked", "wordpress-hacked"],
  ["Database error", "error-establishing-database-connection"],
  ["Locked out", "locked-out-of-wp-admin"],
  ["Checkout broken", "woocommerce-checkout-not-working"],
];
const chips: TriageChip[] = chipGuides.map(([label, slug]) => {
  const g = getGuide(slug);
  if (!g) throw new Error(`Hero chip points at unknown guide "${slug}"`);
  return { label, key: matchKey({ serviceSlug: g.parentService, guideSlug: g.slug }) };
});

// One answer card per match candidate: every guide, plus fix-intent services as the fallback when no guide matches.
const entries: Record<string, TriageEntry> = Object.fromEntries([
  ...guides.map((g) => {
    const s = getService(g.parentService)!;
    const e: TriageEntry = {
      title: g.title,
      errorText: g.errorText,
      causes: g.likelyCauses.slice(0, 2),
      summary: "", // guides always render causes; only service-only entries fall back to a summary
      service: s.id,
      guide: g.slug,
      servicePath: routes.service(s.id),
    };
    return [matchKey({ serviceSlug: s.id, guideSlug: g.slug }), e];
  }),
  ...services
    .filter((s) => s.intent === "fix")
    .map((s) => {
      const e: TriageEntry = {
        title: s.title,
        causes: [],
        summary: s.summary,
        service: s.id,
        servicePath: routes.service(s.id),
      };
      return [matchKey({ serviceSlug: s.id }), e];
    }),
]);

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
            {/* This backdrop is the LCP element, so it preloads. The real photo is low-key, so it needs 50% where the
                daylight placeholder needed 25%; it still reads as texture, never competing with the console. */}
            <Image
              src="/site_images/hero-console-bg.jpg"
              alt=""
              fill
              preload
              quality={55}
              sizes="(min-width: 1024px) 50vw, 60vw"
              className="object-cover object-[35%_95%] opacity-50"
            />
            <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/20 to-bg/60" />
            <div className="absolute inset-0 bg-linear-to-b from-bg via-transparent to-bg" />
          </div>
          <TriageConsole index={matchIndex} entries={entries} chips={chips} />
        </div>

        <p className="max-w-[44ch] text-lg leading-relaxed text-muted lg:col-span-5 lg:row-start-2">
          {/* The guarantee belongs to the legacy business: shown only when brand.legacy.enabled. */}
          {brand.legacy.facts
            ? `Tell us what you see. A senior WordPress engineer diagnoses it, fixes it, and backs it with a ${brand.legacy.facts.guaranteeDays}-day guarantee.`
            : "Tell us what you see. A senior WordPress engineer diagnoses it and fixes it."}
        </p>

        <div data-hero-cta className="flex flex-wrap gap-2 lg:col-span-5 lg:row-start-3 lg:self-start">
          <BookLink location="home:hero" />
          <ChatButton location="home:hero" />
        </div>
      </div>
    </section>
  );
}
