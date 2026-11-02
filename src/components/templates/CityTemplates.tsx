import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { ChatButton, QuoteLink } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { routes, type FlatNode } from "@/config/routes";
import { cities, getService } from "@/content";
import { servicePhotos } from "@/content/photos";
import { citiesLead } from "@/content/notices";
import type { City } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, ClosingBand, Faqs, LinkCards, PageMasthead, RemoteTrack, Section, cardLink, page, pageY } from "./parts";

/** /wordpress-development/cities/: every city, in build priority order. */
export function CityHubTemplate({ node }: { node: FlatNode }) {
  // Counted from src/content, so neither figure can drift from the grid under it.
  const measures = [
    { label: "Cities", value: cities.length },
    { label: "Services these cities ask for", value: new Set(cities.flatMap((c) => c.servicesHighlighted)).size },
  ];

  return (
    <article className={cn(page, pageY)}>
      <Breadcrumbs items={nodeCrumbs(node.path)} />
      {/* A bare h1 with a sentence under it before this, the one inner page with no header box at
          all. `racks` is a mono frame, which is what a page that names every city and favours none
          of them can carry: the work is remote, so no city gets a photograph of itself. */}
      <PageMasthead
        photo="racks"
        title="WordPress development by city"
        lead={citiesLead}
        actions={
          <>
            <QuoteLink location="city-hub" className="btn-primary" />
            <ChatButton location="city-hub" className="btn-secondary" />
          </>
        }
      />

      {/* The header measure /guides/ and /compare/ carry. It cannot go inside the masthead: that
          band composites type over a photograph under `--photo-scrim`, and a 28px numeral is the
          last thing that should be measured against a picture when it can sit on the page instead. */}
      <dl className="rise-in mt-10 grid border-t border-line sm:grid-cols-2 sm:divide-x sm:divide-line" style={{ animationDelay: "210ms" }}>
        {measures.map((m) => (
          <div key={m.label} className="flex items-baseline justify-between gap-4 border-b border-line py-4 sm:block sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:pr-0">
            <dt className="text-sm text-muted sm:order-2 sm:mt-1">{m.label}</dt>
            <dd className="font-display text-[1.75rem] font-extrabold tabular-nums tracking-[-0.03em] [font-variation-settings:'opsz'_28] sm:order-1">{m.value}</dd>
          </div>
        ))}
      </dl>

      {/* Its own card rather than `LinkCards`, because the content here is city-shaped and the
          generic one could only render it as a repeated sentence.

          Every card's title was "WordPress development in <City>", so eight cards opened with the
          same four words and the one word that differs, the only word anyone scans this page for,
          arrived last. The city is the heading now, at 24px display, and the repeated phrase is the
          14px kicker above it. The anchor's text is unchanged in content and order, so the
          accessible name and the internal anchor text are still "WordPress development in Chennai".

          `servicesHighlighted` was tried here as a row of chips and taken out again after looking
          at it. The three or four service titles run 20 to 35 characters, so in a 420px card they
          stacked one per line: four near-full-width pills under every summary, 1,200px added to an
          eight-card page, and "WordPress website design" repeated on most of them. The summary is
          already the thing that separates these cities, and it does it in the words that matter
          (Tamil and English pages, Gujarati pages, Bengali). The services are one click away on the
          page this card opens. */}
      <ul className="reveal mt-10 grid items-stretch gap-4 sm:grid-cols-2">
        {cities.map((c) => (
          <li key={c.slug}>
            <Link href={routes.city(c.slug)} className={cn(cardLink, "flex h-full flex-col")}>
              <span className="text-sm text-muted">WordPress development in</span>
              <span className="mt-1 font-display text-[1.5rem] leading-[1.15] font-extrabold tracking-[-0.03em] transition-colors duration-200 [font-variation-settings:'opsz'_24] motion-reduce:transition-none [@media(hover:hover)]:group-hover:text-accent-text">
                {c.city}
              </span>
              <span className="mt-3 text-sm text-muted">{c.seo.description}</span>
              {/* The caret `LinkCards` gives every other card on the site, on the same 150ms
                  ease-out nudge the buttons use. `mt-auto` parks it on the card's bottom edge, so a
                  row of cards of different heights still agrees on where the affordance is. */}
              <span className="mt-auto flex justify-end pt-4">
                <CaretRightIcon
                  weight="duotone"
                  aria-hidden
                  className="size-5 shrink-0 text-muted transition-[translate] duration-150 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {/* This page ended on the last city in the directory and said nothing after it. Its CTA pair
          moved onto the band in Task 10, which was right for the opening and left the foot of a
          fourteen-row list with no way out. The band every other reading page closes on. */}
      <ClosingBand
        title="Want a quote for your project?"
        actions={
          <>
            <QuoteLink location="city-hub:closing" className="btn-primary" />
            <ChatButton location="city-hub:closing" className="btn-secondary" />
          </>
        }
      />
    </article>
  );
}

/**
 * /wordpress-development/cities/<slug>/. Layout family: masthead over a card grid of doors, then
 * ruled local-context rows and the shared delivery track. Service JSON-LD with areaServed; no
 * LocalBusiness, because there is no office in the city.
 *
 * Rebuilt in Task 38. What it was: a bare h1 and two buttons over a photograph, then four
 * unheaded paragraphs of 160 to 590 characters set as flat `--muted` body, then the services, then
 * `remoteDelivery` as `sm:grid-cols-3` over exactly three entries, which is contract rule 6's
 * three equal cards in a row. The four problems and the four answers, in order:
 *
 * 1. **The hero said nothing.** `PageMasthead` takes a `lead` and this page passed none, so the
 *    one route whose visitor arrived from a city query opened on a title and two controls. The lead
 *    is `seo.description`, which is the sentence already written for this page and the one the
 *    visitor saw in the result they clicked. Two of the eight ran 21 words against rule 4's cap of
 *    20 and were trimmed by a word each in src/content/cities.
 * 2. **The doors arrived third.** Reordered: the services this city asks for now sit directly under
 *    the header, and the prose that used to stand between them is below. A reader who came for
 *    "WooCommerce developer in Pune" reaches the Pune WooCommerce page without reading 1,800
 *    characters about Chakan first, and a reader who wants the context still has it.
 * 3. **The context was a wall.** Same paragraphs, untouched, in a real `Section` with a heading and
 *    two columns at `lg`, each one opening on the ember tick the compare page's scenario cards use.
 *    Four entry edges instead of none, and roughly 900px of stacked text folded away. No heading
 *    per paragraph, because these are four topical blocks per city and any label over them would be
 *    a sentence this site invented about a place it has no office in.
 * 4. **Three equal cards in a row.** Gone to `RemoteTrack`, which /about/ already renders.
 *
 * No hover was added to the context rows. Every card here that lifts is a link, and a panel that
 * answers the pointer without going anywhere is the affordance this system does not hand out.
 */
export function CityTemplate({ city: c, node }: { city: City; node: FlatNode }) {
  const highlighted = c.servicesHighlighted.map((id) => getService(id)!);
  const dev = getService("website-design")!;
  const path = routes.city(c.slug);
  const loc = `city:${c.slug}`;

  return (
    <article className={cn(page, pageY)}>
      <JsonLd
        data={[
          serviceLd(dev, {
            name: `WordPress development in ${c.city}`,
            url: path,
            areaServed: { "@type": "City", name: c.city, containedInPlace: { "@type": "Country", name: "India" } },
          }),
          faqLd(c.faqs),
        ]}
      />
      <Breadcrumbs items={nodeCrumbs(node.path)} />

      {/* The frame comes from the first service this city asks for, which is the nearest honest
          mapping the catalogue offers: there is no office in the city and no photograph of it, so
          the band shows the work rather than the place. */}
      <PageMasthead
        photo={servicePhotos[highlighted[0].id]}
        title={`WordPress development in ${c.city}`}
        lead={c.seo.description}
        actions={
          <>
            <QuoteLink location={`${loc}:hero`} service={highlighted[0]?.id} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} service={highlighted[0]?.id} className="btn-secondary" />
          </>
        }
      />

      <Section id="services" title={`What ${c.city} clients ask for`}>
        <LinkCards items={highlighted.map((s) => ({ href: s.path, title: s.title, summary: s.summary }))} />
      </Section>

      {/* Two columns at `lg` and one below it. Measured on the 1200px spine: each column is 556px,
          which puts a 450-character paragraph at about seven lines. The `68ch` cap is the one this
          content already carried and it binds in exactly one place: the single-column band from 768
          to 1023, where the column is otherwise the full width of the container and the line runs
          far past what anyone reads. In the 2-up grid and at 375 the column is narrower than the
          cap, so the cap is inert there rather than fighting the grid. (`ch` in Geist is 11.27px at
          this size, so 68ch is 766px; it is a container cap, not a character count.)

          It was 404px a task ago, when this page was `max-w-4xl`. The cap did not have to move with
          the container, and that is the point of expressing it in `ch`: it is a measure, and a
          measure does not care how wide the page it sits on is.

          `gap-y-7` against `gap-x-10`: the vertical gap is the one that says "new block" and the
          ember tick is already saying it, so the horizontal gap is the larger of the two. Were they
          equal the 2x2 would read as a four-cell grid rather than as two columns of prose.

          `reveal` on the `ul`, never on `Section`: every `li` is then watched on its own and arrives
          when it crosses the viewport edge rather than when the section does. One animated element
          per ancestor chain, which is the rule that keeps a played reveal from nesting inside
          another one. */}
      <Section id="local" title={`What ${c.city} websites are built to do`}>
        <ul className="reveal grid gap-x-10 gap-y-7 lg:grid-cols-2">
          {c.localContext.map((p) => (
            <li key={p.slice(0, 32)}>
              {/* The compare page's scenario mark, reused for the same reason it exists there: it
                  gives a run of near-identical blocks a start edge to find. A rule and not a dot,
                  because rule 6 bans decorative dots outright. */}
              <span aria-hidden className="block h-px w-8 bg-accent" />
              <p className="mt-4 max-w-[68ch] leading-relaxed text-muted">{p}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="remote" title="How working with us runs">
        <RemoteTrack />
      </Section>

      <Faqs faqs={c.faqs} />

      <ClosingBand
        title={`Want a WordPress team for ${c.city}?`}
        actions={
          <>
            <QuoteLink location={`${loc}:closing`} service={highlighted[0]?.id} className="btn-primary" />
            <ChatButton location={`${loc}:closing`} service={highlighted[0]?.id} className="btn-secondary" />
          </>
        }
      />

      <p className="mt-8 text-sm text-muted">
        <Link href={routes.cities} className="underline underline-offset-4 hover:no-underline">
          Other cities we work with
        </Link>
      </p>
    </article>
  );
}
