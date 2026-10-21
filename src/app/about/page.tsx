import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { aboutLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { Breadcrumbs, LinkRows, Section, h1, h2, page, pageY } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { hubIdOf, hubNodes, routes } from "@/config/routes";
import { guides, services } from "@/content";
import { hubLead } from "@/content/hubs";
import { remoteDelivery } from "@/content/notices";
import { servicePhotos } from "@/content/photos";
import { cn } from "@/lib/utils";

const description = "WordPress engineers for sites that are down, hacked or slow, plus care plans and development.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: routes.about },
};

/**
 * The banner is the full spine, so its box is the inner container and nothing else: 1104px from
 * 1152 up (max-w-6xl, 1152, less the 24px md gutters on both sides), `100vw - 48px` while the
 * container is still narrower than its max at md, and `100vw - 32px` below md where the gutter is
 * 16px. Declared rather than left to `100vw` because the default over-fetches by one whole
 * candidate step at every width: this is the page's LCP image and it is eager.
 */
const bannerSizes = "(min-width: 1152px) 1104px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)";

/**
 * /about/. Layout family: masthead over a full-width photographic band.
 *
 * Deliberately not any of the site's four split headers (the hub's 6/5 lead block, the guide's 8/4
 * error-and-capture, the knowledge base's 7/5 lead-and-instrument, the guarantee's 7/5 column and
 * card). Nothing sits beside this photograph: the words run the full 1104px spine and the picture
 * runs under them at the same width, because the photograph here is not an illustration of a
 * product or an error, it is the only evidence on the page of who does the work. A band wider than
 * the frame it crops is the shape that reads as a masthead rather than as a hero asset parked in a
 * column.
 *
 * The page was a 47-line stack in a `max-w-3xl` column with no image at all, and it closed on a
 * `sm:grid-cols-3` definition list over the three `remoteDelivery` entries, which is the three equal
 * cards contract rule 6 bans outright. It runs on the bare `page` spine now, the same left edge as
 * the hubs, the guides and the knowledge base, with every measure capped in `ch` rather than by
 * narrowing the container.
 *
 * Nothing on this page is asserted about the world. The counts under "What we work on" are
 * `hubNodes`, `services` and `guides` counted at build time, so they cannot drift from what the site
 * actually holds; there is no years-in-business line, no team size, no client volume and no
 * testimonial, because none of those exist in `src/content` as a confirmed fact.
 */
export default function About() {
  return (
    <article className={cn(page, pageY)}>
      <JsonLd data={aboutLd({ name: `About ${brand.name}`, description, path: routes.about })} />
      <Breadcrumbs items={nodeCrumbs(routes.about)} />

      {/* The words sit ON the photograph rather than above it, which is what makes this a masthead
          and not a lead block with a picture parked under it. The band is the one `relative isolate`
          box on the page: photograph and scrim both at -z-10, type in normal flow above them, which
          is `FinalCta`'s shape exactly and the only shape on this site measured for type over
          photography.

          Height comes from the content plus its padding, never from an aspect ratio. An aspect
          ratio was what the two-box version used, and it cannot survive type being moved inside it:
          at 375 a 16/9 band is 211px and the h1, the sentence and the two buttons need more than
          300px, so the words would have overflowed the frame they are supposed to sit in. The
          `md:min-h-[24rem]` is the opposite guard, holding enough frame open at desktop that the
          photograph still reads as a photograph once the type stops filling it. */}
      <header className="relative isolate mt-6 flex flex-col justify-end overflow-hidden rounded-[14px] p-6 shadow-card sm:p-10 md:min-h-[24rem] md:p-14 lg:p-16">
        {/* Hands at a keyboard under one warm light, which is the Imagery section's own art
            direction almost word for word, and the catalogue's one frame of the work itself rather
            than of a desk. The fix hub's `emergency` frame was tried first: cold, and at this crop
            mostly a dark mass, which on a dark page reads as a hole. Real alt text, not
            `decorative`: on a page whose job is to say who we are, the picture is content and no
            sentence beside it describes it. No animation on it at all, because it is the largest
            paint on the page. */}
        <Photo id={servicePhotos["hire-developer"]} preload sizes={bannerSizes} className="absolute inset-0 -z-10" />
        {/* The flat scrim, never a gradient, and the token the site already measured for this:
            `--text` over `--photo-scrim` is 5.6:1 against the brightest pixel a photograph can
            hold. It is why the sentence below is `--on-photo` and no longer `--muted`: muted over
            this same scrim is 2.55:1 and would have failed outright the moment the type moved onto
            the picture. */}
        <span aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />

        {/* Never faded: it is the first thing painted and an LCP candidate. The sentence under it
            arrives one beat later and the buttons that act on it one beat after that, which is the
            same 70/140ms the hub and the guarantee headers run. */}
        <h1 className={h1}>About {brand.name}</h1>
        <p className="rise-in mt-5 max-w-[60ch] text-lg text-on-photo" style={{ animationDelay: "70ms" }}>
          We fix WordPress sites that are down, hacked or slow, look after them afterwards, and build new ones.
        </p>
        <div className="rise-in mt-7 flex flex-wrap gap-3" style={{ animationDelay: "140ms" }}>
          <BookLink location="about:hero" className="btn-primary" />
          <ChatButton location="about:hero" className="btn-secondary" />
        </div>
      </header>

      {/* This section once had to refuse `reveal`: the banner puts its heading within a few pixels
          of the fold at 768, it parked inside its own entry range at load, and a scrubbed opacity
          ramp meant axe read the heading, the lead and all twelve directory strings at part
          opacity. `reveal-rise` no longer touches opacity (globals.css records why), so a park can
          no longer change a contrast ratio and the exception is retired: this section settles like
          every other one. Still written out rather than built with `Section` for the remaining,
          smaller reason: `Section` wraps its children in one `mt-6` div and this one has two blocks
          with their own spacing. The margins and the heading are `Section`'s own. */}
      <section aria-labelledby="what-we-do" className="reveal mt-16 md:mt-24">
        <h2 id="what-we-do" className={h2}>
          What we work on
        </h2>
        {/* All three counted from src/content at build time, which is the only kind of number this
            page is allowed to print: the hubs rendered directly under this sentence, the services
            under them and the guides written against those. The sentence is phrased so no count
            opens it, because `hubNodes.length` sets a numeral where the word "Six" used to be: the
            six was the one figure here that was typed rather than counted, and a sentence that
            argues these numbers cannot drift may not hardcode one of them. */}
        <p className="mt-6 max-w-[60ch] text-muted">
          The {hubNodes.length} areas below hold {services.length} services and {guides.length} written guides to specific WordPress errors.
        </p>
        {/* `split` is new on this call site, and it is the thing that turns this from a stacked
            block of six title-over-paragraph rows into a ruled two-column list: titles in one
            scannable column on the page spine, summaries answering across the gutter from md up.
            The variant exists for exactly this shape and the hub template already uses it. */}
        <div className="mt-6">
          <LinkRows split items={hubNodes.map((h) => ({ href: h.path, title: h.title, summary: hubLead[hubIdOf(h.path)] }))} />
        </div>
      </section>

      <Section id="how" title="How working with us runs">
        {/* The three entries are one engagement in order, not three peers, so they are read down a
            rail instead of across a row of cards. The order is the sequence and the only thing that
            carries it: no numbers and no stage labels, which contract rule 6 bans. Each entry meets
            the rail on a short ember tick, so the group reads as stations on a line rather than as
            one indented block of text. */}
        <dl className="max-w-[70ch] space-y-8 border-l border-line pl-6 md:space-y-10 md:pl-8">
          {remoteDelivery.map((r) => (
            <div key={r.label} className="relative">
              {/* Inside the dt, not beside it: a div inside a dl may hold only dt and dd, so a span
                  as a direct child of this wrapper is invalid even though nothing renders it wrong.
                  Its containing block is unchanged either way, because the nearest positioned
                  ancestor is still the wrapper. */}
              <dt className="font-display text-lg font-bold [font-variation-settings:'opsz'_18]">
                <span aria-hidden className="absolute -left-6 top-[0.7rem] h-px w-4 bg-accent md:-left-8 md:w-6" />
                {r.label}
              </dt>
              <dd className="mt-1.5 max-w-[60ch] text-muted">{r.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* The hub template's closing band. That is a repeat across the site and a deliberate one:
          contract rule 3 forbids a family repeating within one page, and the last thing every
          reading page says is the same offer in the same shape. The heading gives the two buttons a
          question to answer instead of restating the page title. */}
      <section
        aria-labelledby="about-closing"
        className="reveal mt-20 flex flex-col gap-5 border-t border-line pt-10 md:mt-28 md:flex-row md:items-center md:justify-between md:pt-12"
      >
        <h2 id="about-closing" className={cn(h2, "max-w-[24ch]")}>
          Want us to look at your site?
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <BookLink location="about:closing" className="btn-primary" />
          <ChatButton location="about:closing" className="btn-secondary" />
        </div>
      </section>
    </article>
  );
}
