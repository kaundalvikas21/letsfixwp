import type { Metadata } from "next";
import { BookLink, ChatButton } from "@/components/Cta";
import { aboutLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { HoverFill } from "@/components/HoverFill";
import { CountUp, Stagger } from "@/components/motion";
import { ClosingBand, LinkCards, PageMasthead, RemoteTrack, Section, h2, page, pageYMasthead } from "@/components/templates/parts";
import { VideoFrame } from "@/components/VideoFrame";
import { brand } from "@/config/brand";
import { hubIdOf, hubNodes, routes } from "@/config/routes";
import { cities, guides, services } from "@/content";
import { hubLead } from "@/content/hubs";
import { hubIcon } from "@/content/icons";
import { hubBanners } from "@/content/photos";
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
 * card). Nothing sits beside this photograph: the words run the full 1152px spine and the picture
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
    <div className={cn(page, pageYMasthead)}>
      <JsonLd data={aboutLd({ name: `About ${brand.name}`, description, path: routes.about })} />
      {/* The words sit ON the photograph rather than above it, which is what makes this a masthead
          and not a lead block with a picture parked under it. Every reason this shape holds, and
          every number measured for it, now lives on `PageMasthead` in parts.tsx, because the other
          four templates run it too. The only thing left here is what is true of this page alone:
          the picture is not decorative. On a page whose job is to say who we are, hands at a
          keyboard under one warm light are content, and no sentence beside the band describes them.
          The fix hub's `emergency` frame was tried first and is cold, mostly a dark mass at this
          crop, which on a dark page reads as a hole. */}
      <PageMasthead
        crumbs={nodeCrumbs(routes.about)}
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

      {/* This section once had to refuse `reveal` altogether: the banner puts its heading within a
          few pixels of the fold at 768, it parked inside its own entry range at load, and a scrubbed
          opacity ramp meant axe read the heading, the lead and all twelve directory strings at part
          opacity. The reveal is played rather than scrubbed now, so there is no park position for a
          contrast ratio to be caught at, and the exception is retired. Written out rather than built
          with `Section` for the remaining, smaller reason: `Section` wraps its children in one
          `mt-6` div and this one has two blocks with their own spacing. The margins and the heading
          are `Section`'s own, and so is the marker placement: the heading and the sentence carry
          their own, and the card grid carries its own inside `LinkCards`. */}
      <section aria-labelledby="what-we-do" className="mt-16 md:mt-24">
        <h2 id="what-we-do" className={`reveal-self ${h2}`}>
          What we work on
        </h2>
        {/* All three counted from src/content at build time, which is the only kind of number this
            page is allowed to print: the hubs rendered directly under this sentence, the services
            under them and the guides written against those. The sentence is phrased so no count
            opens it, because `hubNodes.length` sets a numeral where the word "Six" used to be: the
            six was the one figure here that was typed rather than counted, and a sentence that
            argues these numbers cannot drift may not hardcode one of them. */}
        <p className="reveal-self mt-6 max-w-[60ch] text-muted">
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
              // Four of the six have one; the other two keep the icon they always had. See
              // hubBanners in src/content/photos.ts for why the map is partial.
              banner: hubBanners[hubIdOf(h.path)],
            }))}
          />
        </div>
      </section>

      {/* The three stations live in `parts.tsx` now, because the city template was rendering these
          same three entries as `sm:grid-cols-3`, which is rule 6's three equal cards in a row. Two
          call sites, one component; every measurement and every ban this shape spends is recorded
          on `RemoteTrack` itself. */}
      {/* The trust strip. Deliberately no heading: the city hub does the same with its two-cell
          measure, and a third h2 on this page would be ordering nothing. Every cell names itself.

          **It sits here, below "What we work on", and not under the masthead where a trust strip
          usually goes.** Measured at 1440, directly under the masthead put its top edge at 592px
          against a 900px viewport, which is inside the first screen, and brief rule 4 keeps the
          first viewport free of anything that animates on scroll. `CountUp` runs for 1.2s, the
          longest value in the motion table. Moved down it is comfortably past the fold at every
          width the site is checked at, the count plays as a reader arrives at it rather than
          before they have looked, and the page reads in a better order anyway: what we work on,
          then how much of it there has been, then how working with us runs.

          **Three of these four are gated claims and the fourth is counted.** `brand.stats` holds
          figures the owner has not confirmed yet, which render here in dev and preview and fail a
          production deploy until they are real (src/config/brand.ts says why that is allowed at
          all, given contract rules 6 and 8). `cities.length` is counted from src/content at build
          time, so the strip is never entirely unverified however long the other three sit.

          Cities rather than services or guides on purpose: those two are already stated as numerals
          in the sentence under "What we work on" a screen below, and a figure that appears twice on
          one page in two different type sizes reads as two different facts.

          Four cells, never three: contract rule 6 bans three equal cards in a row, and the one
          exception the site spends is the delivery track's numerals. Two across at `sm`, four at
          `lg`, one at 375. The divider is a hairline between cells rather than a border around
          each, so the strip reads as one instrument and not as four cards.

          `Stagger` and `CountUp` are the Task 41 primitives doing exactly the job the motion table
          mapped them to. The numerals carry `tabular-nums` from `CountUp` itself, so a digit
          changing mid-count cannot change the cell's width.

          Each cell is a `HoverFill`, whose fill grows out of the cursor rather than sweeping from
          one edge; its own doc comment carries the reasoning, including the part that matters here,
          which is that **these cells are not links** and the Hover Earns It rule normally reserves
          a pointer response for things that go somewhere. Spent on the owner's instruction. */}
      <Stagger
        as="dl"
        className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line"
      >
        {[
          { value: brand.stats.sitesRecovered, suffix: "+", label: "Sites brought back online" },
          { value: brand.stats.yearsRunning, suffix: "", label: "Years fixing WordPress" },
          // "h", not " hrs": the numeral counts up from zero, and on the way it renders every
          // integer below the target. " hrs" puts "1 hrs" on screen for a frame, which is a
          // grammar error however briefly it is up. "1h" is correct at every value it passes.
          { value: brand.stats.firstReplyHours, suffix: "h", label: "Typical first reply" },
          { value: cities.length, suffix: "", label: "Cities we work with" },
        ].map((s) => (
          <HoverFill
            key={s.label}
            className="flex flex-col border-b border-line py-5 lg:border-b-0 lg:px-6 lg:first:pl-0 lg:last:pr-0"
          >
            <dt className="order-2 mt-1.5 text-sm text-muted">{s.label}</dt>
            <dd className="order-1 font-display text-[2.25rem] leading-none font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_36] md:text-[2.75rem] md:[font-variation-settings:'opsz'_44]">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </HoverFill>
        ))}
      </Stagger>


      <Section id="how" title="How working with us runs">
        <RemoteTrack />
      </Section>

      {/* A reserved video slot, and the only new section on this page. It sits directly after the
          three stations rather than under the masthead: the reader has just been told how a job runs,
          and the question that follows is show me. Under the masthead it would instead land inside the
          first viewport at 1440 and compete with the trust strip's count, which is the measurement
          that moved that strip down in the first place.

          Nothing beside it and no text column, so it does not become a third image-plus-text split on
          a page whose masthead is already photographic. The frame holds its own 16/10 box, so filling
          the slot later shifts nothing on the page.

          This page is the right host because its photograph is the one image on the site that is
          evidence rather than decoration (`decorative={false}` above, the only such masthead). A clip
          of the work being done is the next increment of the same evidence, and /about/ carries no
          LCP risk: it is below the fold on a page nobody arrives at mid-emergency. */}
      <Section id="watch" title="Watch a rescue">
        <VideoFrame id="how-a-rescue-runs" className="reveal-self" />
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
    </div>
  );
}
