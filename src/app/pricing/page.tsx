import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink, PlansLink } from "@/components/Cta";
import { collectionLd, faqLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { Breadcrumbs, Faqs, Promises, Section, TickList, h1, h2, page, pageY } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { HUB_LABELS, hubNodes, routes } from "@/config/routes";
import { getService, services } from "@/content";
import { formatPrice, prices, type Price } from "@/content/pricing";
import { cn } from "@/lib/utils";

const seo = {
  title: "Pricing",
  description: "Every WordPress fix is quoted at a fixed price, agreed before work starts. The three ways to work with us, and every service we quote on.",
};

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: routes.pricing },
};

/**
 * The masthead's box is the inner container and nothing else: 1104px from 1152 up (max-w-6xl, 1152,
 * less the 24px md gutters on both sides), `100vw - 48px` while the container is still narrower than
 * its max at md, and `100vw - 32px` below md where the gutter is 16px. The same arithmetic and the
 * same string as /about/, because it is the same box. Declared rather than left to `100vw`, which
 * over-fetches by a whole candidate step at every width on the page's LCP image.
 */
const bannerSizes = "(min-width: 1152px) 1104px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)";

/**
 * A price renders only once the owner publishes it. `src/content/pricing.ts` holds four nulls today
 * and all 32 `priceFrom` values are null, and contract rule 8 says a null renders nothing rather
 * than a placeholder number. `Plans.tsx`'s `from()` is the same helper at the home page's scale;
 * this one is sized for a ruled row rather than an accordion header.
 *
 * `tabular-nums` so two published prices in the same column line up on their digits.
 */
const from = (p: Price | null, unit: string) =>
  p && (
    <span className="shrink-0 whitespace-nowrap">
      <span className="font-display text-xl font-extrabold tabular-nums [font-variation-settings:'opsz'_20]">From {formatPrice(p)}</span>{" "}
      <span className="text-sm text-muted">{unit}</span>
    </span>
  );

/**
 * The three ways to work, the same three the home page's `Plans` names from the same three services.
 *
 * The three labels are `Plans.tsx`'s own words, reused unchanged: they name a mode of engagement
 * rather than a service, so they cannot be read off a content file, and a second wording for the
 * same three choices is the drift Task 8 removed from the promises. Everything else on each row is
 * read from the service file: `whoItsFor` for the sentence (rather than a second copy of `Plans`'
 * hardcoded `who` lines) and `deliverables` for the inclusions, so no row states anything the
 * service pages do not.
 *
 * `slice(0, 4)` on the care plan is not cosmetic: its fifth deliverable is "A clear list of what
 * each tier includes, published on the pricing page", which is a promise about this page that this
 * page cannot keep while every price is null. Taking four on all three keeps the rows level.
 */
const WAYS = [
  { name: "One-time fix", id: "emergency", price: from(prices.fix, "per fix"), cta: <BookLink location="pricing:ways" service="emergency" className="btn-primary" /> },
  { name: "Hacked site cleanup", id: "malware-removal", price: from(prices.cleanup, "per site"), cta: <BookLink location="pricing:ways" service="malware-removal" className="btn-primary" /> },
  { name: "Care plan", id: "care-plans", price: from(prices.planMonthly, "a month"), cta: <PlansLink location="pricing:ways" className="btn-primary" /> },
] as const;

/**
 * The four questions in `src/content/services/` that are actually about what something costs,
 * selected by subject and reproduced verbatim. Nothing here is written for this page.
 *
 * Deliberately not `maintenance-woocommerce`'s "Where can I see plan prices?", whose answer is "The
 * pricing page lists the current plans and what each includes": that is a statement about this page
 * which is not true while `prices` is four nulls, and quoting it here would print the one untruth
 * the content files contain.
 *
 * The lookup throws rather than falling back, so an edit to one of those four service files fails
 * `npm run build` instead of silently dropping a question. Same guard as `src/content/hubs.ts`.
 */
const PRICE_FAQS: [string, string][] = [
  ["website-design", "How much does a WordPress website cost?"],
  ["hire-developer", "What does it cost to hire a WordPress developer?"],
  ["white-label", "How is white-label work priced?"],
  ["care-plans", "Is a care plan better than paying per job?"],
];

const priceFaqs = PRICE_FAQS.map(([id, q]) => {
  const faq = getService(id)?.faqs.find((f) => f.q === q);
  if (!faq) throw new Error(`pricing: service "${id}" no longer carries the FAQ "${q}"`);
  return faq;
});

/**
 * /pricing/, for a business whose prices are not published yet.
 *
 * All 32 services carry `priceFrom: null`, all four entries in `src/content/pricing.ts` are null and
 * all 32 `typicalTurnaround` values are null. The page this replaced was a service directory with a
 * price column that never rendered, and a lead sentence that explained the absence. The absence is
 * not the story: `brand.claims.fixedPrice` is, and a fixed number agreed before anyone touches the
 * site is a stronger answer to "what will this cost me" than a list price would be. Nothing on this
 * page invents a price, a range, a turnaround, a discount or a saving.
 *
 * Six sections, six layout families, none repeated (contract rule 3): a masthead over a photographic
 * band, the ruled ledger of three ways to work, a two-column tick grid of the promises, the grouped
 * service directory, the FAQ disclosure list, and the closing band. No eyebrow, no marquee, no
 * numbered steps, and one image on the page so no two image-plus-text splits can be consecutive.
 */
export default function Pricing() {
  return (
    <div className={cn(page, pageY)}>
      {/* The only truthful structured data for this page. `CollectionPage` with its `ItemList` says
          what the page is: an index of the 32 services, every name and url read from src/content so
          the list cannot claim something the page does not render. Deliberately **no** `OfferCatalog`
          and no `Offer`: an Offer with no `price` is the node the brief forbids and Google treats a
          priceless Offer as invalid anyway. Deliberately no per-service `Service` nodes either, which
          would restate 32 entities that already declare themselves on their own canonical pages.
          Never `AggregateRating` or `Review`: there is no review data. The Organization is referenced
          by @id from the root layout rather than redeclared, which is what every other node here
          does. `faqLd` is emitted because the four questions are real, verbatim and rendered on the
          page, which is the same bar `ServiceTemplate` and `GuideTemplate` already meet. */}
      <JsonLd
        data={[
          collectionLd({
            name: seo.title,
            description: seo.description,
            path: routes.pricing,
            items: services.map((s) => ({ name: s.title, path: s.path })),
          }),
          faqLd(priceFaqs),
        ]}
      />
      <Breadcrumbs items={nodeCrumbs(routes.pricing)} />

      {/* The /about/ masthead, which is this site's one measured pattern for type over photography
          (commit 4557bb4) and the pattern the brief routes here rather than inventing a second one:
          one `relative isolate` box, photograph and flat `bg-photo-scrim` both at -z-10, type in
          normal flow above them. Height comes from content plus padding and never from an aspect
          ratio: at 375 a 16/9 band is 211px and an h1, a sentence and two buttons need more than
          300px, so an aspect-driven box would have type overflowing the frame it sits in.
          `md:min-h-[22rem]` is the opposite guard, holding enough frame open at desktop that the
          photograph still reads as a photograph.

          The lead is `text-on-photo` and never `text-muted`: muted over this scrim measures 2.55:1.
          `--on-photo` is `--text`, and the scrim's own floor is tone-independent, because the scrim
          composites a blown-out white pixel to rgb(95 95 95) against which `--text` is 5.6:1. */}
      <header className="relative isolate mt-6 flex flex-col justify-end overflow-hidden rounded-[14px] p-6 shadow-card sm:p-10 md:min-h-[22rem] md:p-14 lg:p-16">
        {/* A tidy desk under one warm floor lamp against a dark wall, which is the Imagery section's
            own art direction: night-time photography, a single warm source, against the dark page.
            `drafting` was tried first, because a hand drawing a wireframe is the only frame in the
            catalogue whose *subject* is this page's subject, a scope agreed before work starts. It
            was rejected on tone: it is a `daylight` frame, and even under the scrim it was the
            brightest thing on a dark-locked page and read as a stock photograph pasted into the
            system. The variation's lock is binding spec and subject relevance is a preference.

            `decorative` therefore, with an empty alt. The frame is here for register, not for
            evidence, and nothing on this page is about desks: announcing "a tidy desk with a curved
            monitor" to a screen reader in the middle of a pricing headline would be noise. That is
            the opposite call from /about/'s masthead and it is the opposite situation; there, the
            photograph was the page's only evidence of who does the work. No animation on it at all,
            because it is the largest paint on the page. */}
        <Photo id="workspace" decorative preload sizes={bannerSizes} className="absolute inset-0 -z-10" />
        <span aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />

        {/* The pricing model is the headline. `brand.claims.fixedPrice` is confirmed and its own
            approved sentence is "fixes are fixed price, agreed before work starts"; this is that
            clause, not a new claim. Never faded: it is the LCP candidate. The sentence under it is
            the one this page already carried, less the half that apologised for the missing prices.
            70ms and 140ms behind the h1, the same beat as the hub, the knowledge base and /about/. */}
        <h1 className={h1}>Fixed price, agreed before work starts</h1>
        <p className="rise-in mt-5 max-w-[58ch] text-lg text-on-photo" style={{ animationDelay: "70ms" }}>
          Each fix is quoted at a fixed price before any work starts, once an engineer has seen the problem.
        </p>
        <div className="rise-in mt-7 flex flex-wrap gap-3" style={{ animationDelay: "140ms" }}>
          <BookLink location="pricing:hero" className="btn-primary" />
          <ChatButton location="pricing:hero" className="btn-secondary" />
        </div>
      </header>

      {/* Three full-width ruled rows, not the home page's `ExpandingRows` and not three cards.
          `ExpandingRows` is a client island that shows one row at a time, which is right for a
          teaser and wrong here: this is the page where the three are compared, and it would leave
          two thirds of the inclusions behind `hidden` and out of reach of a reader who is scanning.
          It would also need a second copy of its rows, which is the drift this file avoids by
          reading `whoItsFor` and `deliverables` instead. Three equal cards in a row is banned
          outright (contract rule 6), so the unit is a row of one list: the choice reads down the
          page, the way the catalogue below it does, and the whole section ships with no JS.

          The price sits on the name's own baseline at the right edge of the left column, which is
          space the row already allocates. When `prices.fix` stops being null the number appears
          there and nothing under it moves. */}
      <Section id="ways" title="Three ways to work with us">
        <ul className="divide-y divide-line border-y border-line">
          {WAYS.map((w) => {
            const s = getService(w.id)!;
            return (
              <li key={w.name} className="grid gap-x-10 gap-y-6 py-8 md:grid-cols-12 md:py-10">
                <div className="md:col-span-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="font-display text-[1.5rem] leading-[1.15] font-extrabold tracking-[-0.03em] [font-variation-settings:'opsz'_24]">
                      {/* The label is the link text, so the accessible name is the visible name and
                          one click gets from the choice to the scope behind it. */}
                      <Link href={s.path} className="transition-colors duration-200 hover:text-accent-text">
                        {w.name}
                      </Link>
                    </h3>
                    {w.price}
                  </div>
                  <p className="mt-3 max-w-[46ch] text-muted">{s.whoItsFor}</p>
                  <div className="mt-6">{w.cta}</div>
                </div>
                {/* The inclusions answer the name across a hairline from md up, and stack under it
                    below md. The rule is the only thing dividing the two columns, so the row needs
                    no card around it. */}
                <div className="md:col-span-7 md:border-l md:border-line md:pl-10">
                  <TickList items={s.deliverables.slice(0, 4)} />
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* `Promises` from parts.tsx, its third call site, rendering the four confirmed
          `brand.claims` sentences and nothing else. Not re-implemented and not reworded: the words
          are the owner's, they live in src/content/notices.ts, and a row renders only while its own
          claim is truthy. The two-column override is this page's own: four one-line commitments read
          as a block in one column and as a set in two, and `className` is last in the component's
          `cn()` call (commit af4d745) so the override lands. */}
      <Section id="agree" title="What you are agreeing to">
        <Promises className="sm:grid-cols-2 sm:gap-x-10" />
      </Section>

      {/* The full catalogue, which is this page's SEO surface and its long tail: all 32 service
          links stay in the server-rendered HTML. What changed is the shape. It was six near
          identical full-width blocks, each a 32px heading over a long hub lead over a ruled list:
          2,989px at 1440 and 3,209px at 375, measured in the browser on the build this replaced, in
          which no two hubs were ever visible at once. The same 32 links are 1,314px and 2,359px
          here. Six groups pack two abreast, so a visitor sees three or four of them together and
          reads the one that matches their problem.

          The hub leads are gone on purpose. They are six paragraphs of prose that each hub page
          already carries as its own opening, and repeating them here made this page a second copy
          of six pages rather than an index of them. The group heading links to the hub, which is
          where that prose belongs.

          `HUB_LABELS` rather than `hub.title`: the SITEMAP titles are written for search ("WordPress
          maintenance and care plans"), and the short labels are the ones the nav and the problem
          tiles already use for exactly this job.

          Each row reserves its price in a second grid cell. `auto` means the cell is zero wide while
          every `priceFrom` is null, so nothing shows a gap today, and the number appears in its own
          column rather than pushing into the title when one is published. */}
      <Section id="catalogue" title="Everything we quote on">
        <p className="max-w-[60ch] text-muted">
          {services.length} services across {hubNodes.length} areas. Each page sets out its own scope, what you get and the questions people ask about it.
        </p>
        {/* `columns`, not `grid-cols-2`. A two-column grid aligns its tracks by row, and these six
            groups hold 11, 4, 4, 3, 6 and 4 services, so the eleven-row Fixes group set the height
            of the row beside it and left roughly 360px of hole under Security at 1440, measured off
            the screenshot of that version. A column flow balances the two columns by height instead and packs the groups against each other.
            `break-inside-avoid` keeps a group whole; the tallest group is well under half the
            section, so none of them has to be split. Reading order is unchanged, because a column
            flow runs in DOM order down one column and then down the next. */}
        <div className="mt-8 md:columns-2 md:gap-x-10 lg:gap-x-16">
          {hubNodes.map((hub) => (
            <div key={hub.path} className="mb-10 break-inside-avoid last:mb-0">
              <h3 className="font-display text-lg font-bold [font-variation-settings:'opsz'_18]">
                <Link href={hub.path} className="transition-colors duration-200 hover:text-accent-text">
                  {HUB_LABELS[hub.path]}
                </Link>
              </h3>
              <ul className="mt-3 divide-y divide-line border-t border-line">
                {services
                  .filter((s) => s.path.startsWith(hub.path))
                  .map((s) => (
                    <li key={s.id}>
                      {/* py-3 against a 27px line makes a 51px row, over the contract's 44px
                          floor, so a 32-link directory needs no exception for its targets. */}
                      <Link
                        href={s.path}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-3 transition-colors duration-200 hover:text-accent-text"
                      >
                        <span>{s.title}</span>
                        {s.priceFrom && <span className="font-display text-sm font-bold tabular-nums">From {s.priceFrom}</span>}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* The four cost questions already answered in src/content/services/, in the plain disclosure
          list parts.tsx owns. Nothing here is written for this page, which is why the page can carry
          a FAQ section at all. */}
      <Faqs faqs={priceFaqs} title="What people ask about cost" />

      {/* The closing band every reading page on this site ends on, which is a repeat across routes
          and a deliberate one: the last thing each page says is the same offer in the same shape.
          The heading gives the buttons a question to answer instead of restating the page title. */}
      <section
        aria-labelledby="pricing-closing"
        className="reveal mt-20 flex flex-col gap-5 border-t border-line pt-10 md:mt-28 md:flex-row md:items-center md:justify-between md:pt-12"
      >
        <h2 id="pricing-closing" className={cn(h2, "max-w-[24ch]")}>
          Want a price for your site?
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <BookLink location="pricing:closing" className="btn-primary" />
          <ChatButton location="pricing:closing" className="btn-secondary" />
        </div>
      </section>
      {/* `checkTurnaround` is a confirmed claim ("two working days") and the only turnaround figure
          on the site that is not null, so it is the one number this page may print. Gated, because
          an unconfirmed claim renders nothing. */}
      {brand.claims.checkTurnaround && (
        <p className="mt-6 text-sm text-muted">
          Not urgent? <CheckLink location="pricing" />, back in {brand.claims.checkTurnaround}.
        </p>
      )}
    </div>
  );
}
