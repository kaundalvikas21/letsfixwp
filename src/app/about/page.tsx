import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { aboutLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { Breadcrumbs, ClosingBand, LinkCards, PageMasthead, Section, h2, page, pageY } from "@/components/templates/parts";
import { brand } from "@/config/brand";
import { hubIdOf, hubNodes, routes } from "@/config/routes";
import { guides, services } from "@/content";
import { hubLead } from "@/content/hubs";
import { hubIcon } from "@/content/icons";
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
          and not a lead block with a picture parked under it. Every reason this shape holds, and
          every number measured for it, now lives on `PageMasthead` in parts.tsx, because the other
          four templates run it too. The only thing left here is what is true of this page alone:
          the picture is not decorative. On a page whose job is to say who we are, hands at a
          keyboard under one warm light are content, and no sentence beside the band describes them.
          The fix hub's `emergency` frame was tried first and is cold, mostly a dark mass at this
          crop, which on a dark page reads as a hole. */}
      <PageMasthead
        photo={servicePhotos["hire-developer"]}
        decorative={false}
        title={`About ${brand.name}`}
        lead="We fix WordPress sites that are down, hacked or slow, look after them afterwards, and build new ones."
        actions={
          <>
            <BookLink location="about:hero" className="btn-primary" />
            <ChatButton location="about:hero" className="btn-secondary" />
          </>
        }
      />

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
        {/* Six hubs, six doors, so they are cards rather than the ruled two-column rows this used
            to render: the sentence above counts them and the grid is where the reader picks one. Two
            across, which divides six evenly and leaves no card stranded beside a hole, and the page
            carries no other card grid for it to repeat. */}
        <div className="mt-6">
          <LinkCards
            items={hubNodes.map((h) => ({
              href: h.path,
              title: h.title,
              summary: hubLead[hubIdOf(h.path)],
              icon: hubIcon[hubIdOf(h.path) as keyof typeof hubIcon],
            }))}
          />
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
      <ClosingBand
        title="Want us to look at your site?"
        actions={
          <>
            <BookLink location="about:closing" className="btn-primary" />
            <ChatButton location="about:closing" className="btn-secondary" />
          </>
        }
      />
    </article>
  );
}
