import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink, PlansLink } from "@/components/Cta";
import { collectionLd, faqLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, ClosingBand, Faqs, PageMasthead, Promises, Section, TickList, page, pageY } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { HUB_LABELS, hubIdOf, hubNodes, routes } from "@/config/routes";
import { getService, services } from "@/content";
import { hubIcon } from "@/content/icons";
import { formatPrice, prices, type Price } from "@/content/pricing";
import { cn } from "@/lib/utils";

/**
 * The masthead, gated on the one claim it rests on.
 *
 * `brand.claims.fixedPrice` is still wrapped in `confirm(...)` in src/config/brand.ts, which means
 * the owner has **not** confirmed it. It reads `true` in dev and in a local build, and a production
 * deploy fails while it is unconfirmed, so nothing untrue can ship today. That is not the risk. The
 * risk is the owner's next action, which is to go through those values and set each one: confirming
 * this one as `false` would leave the h1, the lead and the meta description all asserting a pricing
 * model the business does not run, with no build failure to catch it. `Promises` already gates it
 * per claim and `Practices.tsx` gates this exact boolean in the same way, which is the house
 * answer: a false claim removes its words rather than softening them.
 *
 * Every other page on this site risks a sentence. This one risks its whole premise, because the
 * claim IS the page's answer to "what will this cost me", so the three strings are gated together
 * from one place and cannot drift apart.
 *
 * **The fallback asserts nothing about how pricing works.** It is the page's own name, which is
 * already its `<title>` and its last breadcrumb, over a sentence that describes only what the page
 * contains. It does not author a replacement claim, and it does not apologise for the absent prices
 * either, which was the old page's mistake.
 */
const MASTHEAD = brand.claims.fixedPrice
  ? {
      h1: "Fixed price, agreed before work starts",
      lead: "Each fix is quoted at a fixed price before any work starts, once an engineer has seen the problem.",
      description: "Every WordPress fix is quoted at a fixed price, agreed before work starts. The three ways to work with us, and every service we quote on.",
    }
  : {
      h1: "Pricing",
      lead: "Three ways to work with us, and every service we work on, with what each one covers and what you get.",
      description: "The three ways to work with us and every WordPress service we quote on, each with its own scope, deliverables and questions.",
    };

const seo = { title: "Pricing", description: MASTHEAD.description };

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: routes.pricing },
};

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
          (commit 4557bb4). It is `PageMasthead` now, shared with the five templates, so the box,
          the flat scrim, the no-aspect-ratio rule and the 70/140ms beat all live in parts.tsx and
          this page states only what is true of it alone.

          `workspace`: a tidy desk under one warm floor lamp against a dark wall, which is the
          Imagery section's own art direction. `drafting` was tried first, because a hand drawing a
          wireframe is the only frame in the catalogue whose *subject* is this page's subject, a
          scope agreed before work starts. It was rejected on tone: it is a `daylight` frame, and
          even under the scrim it was the brightest thing on a dark-locked page and read as a stock
          photograph pasted into the system. The variation's lock is binding spec and subject
          relevance is a preference.

          Decorative therefore, with an empty alt. The frame is here for register, not for evidence,
          and nothing on this page is about desks: announcing "a tidy desk with a curved monitor" to
          a screen reader in the middle of a pricing headline would be noise. That is the opposite
          call from /about/'s masthead and it is the opposite situation; there, the photograph was
          the page's only evidence of who does the work.

          `22rem` rather than the shared `24rem`: the lead here is one line shorter, and the band was
          measured at this height.

          The headline is the pricing model while the claim behind it holds. `brand.claims.fixedPrice`
          is an **unconfirmed** claim whose approved wording is "fixes are fixed price, agreed before
          work starts", and `MASTHEAD` above carries both arms and the reason for the gate. */}
      <PageMasthead
        photo="workspace"
        title={MASTHEAD.h1}
        lead={MASTHEAD.lead}
        minH="md:min-h-[22rem]"
        actions={
          <>
            <BookLink location="pricing:hero" className="btn-primary" />
            <ChatButton location="pricing:hero" className="btn-secondary" />
          </>
        }
      />

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
                          one click gets from the choice to the scope behind it.

                          `inline-flex min-h-11 items-center` because a bare inline anchor around
                          24px display type is a 28px target, under contract rule 5's 44px floor.
                          axe's default ruleset carries no target-size rule, so a clean sweep says
                          nothing about this; it is the same repair `docs/layout-ledger.md` records
                          for the knowledge base's result rows and the same three classes
                          `src/app/guides/page.tsx` carries on the identical heading link. `inline-flex` keeps the
                          anchor inline inside the h3, so the heading's own baseline and the price
                          sitting on it do not move. */}
                      <Link href={s.path} className="inline-flex min-h-11 items-center transition-colors duration-200 hover:text-accent-text">
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
        {/* `columns`, not `grid-cols-2`, and the reason is measured rather than stylistic: the six
            groups hold 11, 4, 4, 3, 6 and 4 services, so in a two-column grid the eleven-row Fixes
            group sets the height of the row beside it and leaves roughly 360px of hole under
            Security at 1440. A column flow balances the two columns by height and packs the groups
            against each other. `break-inside-avoid` keeps a group whole, and the tallest is well
            under half the section so none has to split. Reading order is unchanged: a column flow
            runs in DOM order down one column, then down the next.

            That reasoning survives the groups becoming cards, which is what changed here. It was 32
            identical text rows under six bare headings, which reads as a sitemap rather than as a
            catalogue of work. Each group is a panel on the site's own card tokens now, carrying the
            hub's own mark from `content/icons.ts` and a count of what is in it, and each row answers
            the pointer. */}
        <div className="mt-8 md:columns-2 md:gap-x-10 lg:gap-x-16">
          {hubNodes.map((hub) => {
            const inHub = services.filter((s) => s.path.startsWith(hub.path));
            const Mark = hubIcon[hubIdOf(hub.path) as keyof typeof hubIcon];
            return (
              <div key={hub.path} className="mb-8 break-inside-avoid rounded-[14px] border border-line bg-surface p-5 shadow-card last:mb-0 md:p-6">
                {/* The 44px box is the same repair the knowledge base index carries on this heading:
                    these six were 22px inline targets sitting directly above 51px service rows,
                    which is the one inconsistency a thumb would actually feel. The count is read off
                    the list below it, so it cannot drift from what is there. */}
                <h3 className="flex items-center justify-between gap-3 font-display text-lg font-bold [font-variation-settings:'opsz'_18]">
                  <Link href={hub.path} className="inline-flex min-h-11 items-center gap-2.5 transition-colors duration-200 hover:text-accent-text">
                    <Mark weight="duotone" aria-hidden className="size-5 shrink-0 text-accent-text" />
                    {HUB_LABELS[hub.path]}
                  </Link>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-muted">{inHub.length}</span>
                </h3>
                {/* The marker goes here rather than on the `columns-2` container above: a transform on a
                    column-fragmented box is under-specified across engines, and this card is
                    `break-inside-avoid`, so nothing inside it is fragmented. */}
                <ul className="reveal mt-2 divide-y divide-line border-t border-line">
                  {inHub.map((s) => (
                    <li key={s.id}>
                      {/* py-3 against a 27px line makes a 51px row, over the contract's 44px floor,
                          so a 32-link directory needs no exception for its targets.

                          The hover is the site's row idiom, the one the practice rows use: the row's
                          own hairline is replaced by an ember one growing from the left, so nothing
                          thickens and nothing moves. `transition-[scale]`, never `transition-transform`,
                          because Tailwind v4 writes `scale-x-*` to the standalone `scale` property.
                          Mouse only, or a tap would leave a row lit with no way to clear it. */}
                      <Link
                        href={s.path}
                        className="group relative flex items-center justify-between gap-x-4 py-3 transition-colors duration-200 hover:text-accent-text"
                      >
                        <span>{s.title}</span>
                        <span className="flex shrink-0 items-center gap-3">
                          {s.priceFrom && <span className="font-display text-sm font-bold tabular-nums">From {s.priceFrom}</span>}
                          <CaretRightIcon
                            weight="duotone"
                            aria-hidden
                            className="size-4 text-muted transition-[translate,color] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
                          />
                        </span>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-[scale] duration-[260ms] ease-[var(--ease-spring)] motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-x-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* The four cost questions already answered in src/content/services/, in the plain disclosure
          list parts.tsx owns. Nothing here is written for this page, which is why the page can carry
          a FAQ section at all. */}
      <Faqs faqs={priceFaqs} title="What people ask about cost" />

      {/* The closing band every reading page on this site ends on, which is a repeat across routes
          and a deliberate one: the last thing each page says is the same offer in the same shape.
          The heading gives the buttons a question to answer instead of restating the page title. */}
      <ClosingBand
        title="Want a price for your site?"
        actions={
          <>
            <BookLink location="pricing:closing" className="btn-primary" />
            <ChatButton location="pricing:closing" className="btn-secondary" />
          </>
        }
      />
      {/* `checkTurnaround` is a confirmed claim ("two working days") and the only turnaround figure
          on the site that is not null, so it is the one number this page may print. Gated, because
          an unconfirmed claim renders nothing. */}
      {brand.claims.checkTurnaround && (
        <p className="mt-6 text-sm text-muted">
          Not urgent? <CheckLink location="pricing" icon={null} />, back in {brand.claims.checkTurnaround}.
        </p>
      )}
    </div>
  );
}
