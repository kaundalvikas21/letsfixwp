import { BookLink, ChatButton, CheckLink, PlansLink, QuoteLink } from "@/components/Cta";
import type { CtaIntent } from "@/config/cta";
import { railPoints } from "@/content/notices";

/**
 * Every page's closing CTA, in one component.
 *
 * Seven pages each had their own closing band, all of them the split family (text left, buttons right), while
 * the home page had the gradient panel. One shared component instead, so the last thing a visitor sees is the
 * same offer in the same shape wherever they are, and so a change to it is one edit rather than eight.
 *
 * Shaped to the usual closing-CTA sequence rather than just the headline and buttons the home page had: an
 * outcome headline, a line saying what actually happens next, the page's own primary beside chat, and a
 * reassurance line underneath. The reassurance is `railPoints`, so it is the same gated promises the rest of
 * the site makes and it disappears if the owner turns those claims off.
 *
 * `intent` is the page's SITEMAP node intent, so a plan page closes on its plans CTA and a project page on its
 * quote CTA rather than every page closing on the booking one (docs/foundation.md, conversion plumbing). The
 * wording of each never appears here: it comes from CTA in src/config/cta.ts and nowhere else.
 *
 * The mesh: MASTER allowed one radial mesh on "the final CTA only", written when the home page was the only
 * page with one. It now reads as each page's final CTA, recorded in MASTER and the ledger rather than assumed.
 */
export function ClosingCta({
  id,
  title,
  sub,
  intent = "BOOK",
  location,
  service,
  showCheck = false,
}: {
  id: string;
  title: string;
  sub?: string;
  intent?: CtaIntent;
  location: string;
  service?: string;
  /** CHECK belongs only where the visitor is not in an emergency (foundation.md). */
  showCheck?: boolean;
}) {
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;

  return (
    <section data-reveal aria-labelledby={id} className="mx-auto max-w-6xl px-4 pt-16 pb-20 md:px-6 lg:pt-24">
      <div className="cta-mesh rounded-[20px] px-6 py-16 text-center text-on-cta shadow-card md:px-16 md:py-20">
        <h2 id={id} className="mx-auto max-w-[18ch] font-display text-4xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">
          {title}
        </h2>
        {sub && <p className="mx-auto mt-5 max-w-[52ch] text-lg opacity-90">{sub}</p>}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Primary location={location} service={service} className="btn-primary bg-on-cta text-cta-ink" />
          <ChatButton location={location} service={service} className="btn-secondary border-on-cta bg-transparent text-on-cta" />
        </div>

        {/* The promises, as one quiet line. Same gated set the conversion rail shows, so nothing is claimed
            here that is not claimed elsewhere, and an owner turning a claim off empties this too. */}
        {railPoints.length > 0 && (
          <p className="mx-auto mt-7 max-w-[60ch] text-sm opacity-85">{railPoints.join(" ")}</p>
        )}

        {showCheck && (
          <p className="mt-5 text-sm opacity-85">
            <CheckLink location={location} service={service} icon={false} className="underline underline-offset-4 hover:no-underline" />
          </p>
        )}
      </div>
    </section>
  );
}
