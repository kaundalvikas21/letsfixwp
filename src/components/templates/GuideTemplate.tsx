import { WarningIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { faqLd, guideLd, JsonLd } from "@/components/JsonLd";
import { ScrollProgress } from "@/components/motion";
import { CLOSING_ASK } from "@/config/cta";
import { routes } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { coreFileWarning } from "@/content/notices";
import { servicePhotos } from "@/content/photos";
import type { Guide } from "@/content/schema";
import { cn } from "@/lib/utils";
import { card, ClosingBand, ErrorCards, Faqs, PageMasthead, RealScreen, Section, page, pageYMasthead } from "./parts";
import { ReadingRail } from "./ReadingRail";

/**
 * This page's own heading scale, one step under the shared inner h2 (26/32), set as a scoped
 * descendant override rather than as a prop on `Section` so that `Faqs`'s heading moves with the
 * other five and no shared primitive changes signature.
 *
 * It sits on the reading column and not on the `<article>`, which is where it started. That was the
 * same thing while every section was in the column. Two are not any more: "Other errors we fix" and
 * the closing band both run the full spine now, and from the article the override reached them too,
 * so the closing band rendered at 26px on these 37 pages and 32px on the other eleven that share
 * the identical component. The step-down is a property of the reading document, so it is scoped to
 * the reading document. A guide is a reading document: against 17px
 * body a 26px h2 is a 1.53 ratio, which scans without shouting, and the heading is no longer the
 * loudest thing on a page that now also carries an error string, a banner and a rail.
 */
const guideHeadings =
  "[&_h2]:text-[1.375rem] [&_h2]:[font-variation-settings:'opsz'_22] md:[&_h2]:text-[1.625rem] md:[&_h2]:[font-variation-settings:'opsz'_26]";

/**
 * /guides/<slug>/. Layout family: split header (the error, then the picture of it) over a lead column
 * with a sticky orientation-and-conversion rail at lg. Informational intent, so the page answers
 * first and books second: the rail is the only conversion surface above "When to call us", and the
 * reading measure is capped in ch inside a column that measures 720px, exactly what the old
 * max-w-3xl container held.
 */
export function GuideTemplate({ guide: g }: { guide: Guide }) {
  const parent = getService(g.parentService)!;
  const loc = `guide:${g.slug}`;
  const siblings = guidesFor(g.parentService).filter((x) => x.slug !== g.slug);

  return (
    <article id="guide-article" data-urgency={g.urgency} className={cn(page, pageYMasthead)}>
      {/* The one route family that carries a progress bar. Contract rule 6 bans scroll cues and
          this is an owner-instructed, scoped exception: a guide runs to several thousand pixels of
          troubleshooting and the reader wants to know how much of it is left. Scoped by being
          mounted here and nowhere else, and it reports this article's length rather than the
          document's, so the footer does not make the guide look longer than it is. */}
      <ScrollProgress target="#guide-article" />
      <JsonLd data={[guideLd(g), faqLd(g.faqs)]} />

      {/* The 8/4 split is gone. The parent service's night frame was a 336px panel in the right-hand
          four columns and is the band itself now, which is the shape every inner page here runs. The
          error string moves onto it: the h1 says which error this is and the plate under it is the
          error, so the two belong in one box. All 37 guides get a band, because the photograph is
          the fallback arm and the capture was only ever on four of them.

          The photograph does not depict the error, so it carries no alt: `g.image.alt` describes a
          capture that does not exist on 33 of these pages, and using it would describe the wrong
          picture. */}
      {/* Two CTAs, and the same two the rail carries further down. The page is informational and
          the reader arrived from a search for this exact string, so the band answers "is this my
          error" first and offers the two ways out second: the high-commitment one that starts the
          fix, and the low-friction one for the reader who is not ready to book. Neither is a third
          choice, because a third is what makes a visitor choose nothing. */}
      <PageMasthead
        crumbs={[
          { name: "Home", path: routes.home },
          { name: "Knowledge Base", path: routes.guides },
          { name: g.title, path: routes.guide(g.slug) },
        ]}
        photo={servicePhotos[g.parentService]}
        title={g.h1}
        plate={g.errorText}
        actions={
          <>
            <BookLink location={`${loc}:hero`} service={parent.id} guide={g.slug} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} service={parent.id} className="btn-secondary" />
          </>
        }
      />

      {/* No top margin: the first Section's own 64/96 carries the gap, and the rail starts level with
          the body rather than 112px below the header. */}
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-rail-scope className={cn("lg:col-span-8", guideHeadings)}>
          <Section id="symptoms" title="What you are seeing">
            {/* Capped on the same measure as every paragraph on the page: the column is 720px, which
                is 88 characters of 17px Geist, and a symptom is a sentence. */}
            <ul className="reveal ml-5 max-w-[68ch] list-disc space-y-2 text-muted marker:text-accent-text">
              {g.symptoms.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            {/* The real capture of this error, on the four guides that have one. It is what this
                section is already about: the list says what you are seeing, and this is it.

                No wrapper around it. There was one, and because `RealScreen` returns `null` while
                its PNG does not exist and the wrapper did not, 33 of the 37 guides rendered an
                empty `<figure>` carrying a live `mt-6`, and the four that do have a capture rendered
                a figure inside a figure. The margin and the measure are the component's own
                `className` now, so there is nothing left to render when there is nothing to show
                (contract rule 7, docs/image-todo.md). */}
            <RealScreen
              slot={g.image.slot}
              alt={g.image.alt}
              sizes="(min-width: 816px) 680px, calc(100vw - 32px)"
              className="mt-6 max-w-[68ch]"
            />
          </Section>

          <Section id="causes" title="What usually causes it">
            {/* Tiles, not a second bullet list: no layout family repeats on a page (contract rule 3). */}
            <ul className="reveal grid gap-3 sm:grid-cols-2">
              {g.likelyCauses.map((x) => (
                <li key={x} className="rounded-[14px] border border-line bg-surface p-4 text-sm text-muted">
                  {x}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="safe-checks" title="Safe things to try first">
            <ol className="reveal max-w-[68ch] space-y-4">
              {g.safeChecks.map((x, i) => (
                <li key={x} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-[14px] bg-accent-tint font-display text-sm font-bold text-accent-text">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{x}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex max-w-[68ch] gap-3 rounded-[14px] border border-line-strong bg-surface-2 p-4 text-sm">
              <WarningIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
              <span>{coreFileWarning}</span>
            </p>
          </Section>

          {/* The heading was already an invitation and the block still read as another article
              section: a paragraph, a link, two loose buttons and a footnote, stacked in the reading
              column with nothing marking them off from "What usually causes it" above.

              It is a panel on the site's own card tokens, with the argument and the action
              separated by a hairline. That separation is the whole design: above the rule is the
              reason to hand this over, below it is the handing over. Stacked in one column they
              read as four more paragraphs; split, the eye can take the offer without reading the
              case for it again.

              The free-site-check sits opposite the buttons rather than under them, because it is
              the other door and not a footnote to the first one: it is for the reader whose site is
              not down, who would otherwise find nothing here addressed to them.

              The h2 stays outside the panel. It belongs to the document outline, and `ReadingRail`
              derives its ticks from `h2[id]` inside the reading column. */}
          <Section id="call-us" title="When to call us">
            <div className={cn(card, "reveal-self overflow-hidden p-6 md:p-8")}>
              <span aria-hidden className="block h-px w-10 bg-accent" />
              <p className="mt-5 max-w-[68ch] text-muted">{g.whenToCallUs}</p>
              <p className="mt-4 text-[15px]">
                How we fix it:{" "}
                <Link href={parent.path} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
                  {parent.title}
                </Link>
              </p>

              {/* One wrapping row, not a `md:flex-row` split. The reading column is 704px and the
                  panel's padding takes 64 of it, so the two buttons and the sentence never fit on
                  one line here: forcing the split only made the buttons stack and the sentence sit
                  beside the gap they left. Wrapping puts the sentence under them when it has to go
                  there, and opposite them in any container wide enough to hold both. */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-7">
                <div className="flex flex-wrap gap-3">
                  <BookLink location={`${loc}:call-us`} service={parent.id} guide={g.slug} className="btn-primary" />
                  <ChatButton location={`${loc}:call-us`} service={parent.id} className="btn-secondary" />
                </div>
                <p className="text-sm text-muted">
                  Nothing down right now? <CheckLink location={`${loc}:call-us`} service={parent.id} icon={null} />
                </p>
              </div>
            </div>
          </Section>

          <Faqs faqs={g.faqs} />

        </div>

        {/* Orientation first, conversion second, which is the order this surface is read in: the
            service page's rail family, scoped per page (contract rule 3 is an intra-page rule). It is
            lg-only; under 768px the global bottom action bar is the persistent CTA and between the
            two the page's own "When to call us" is. ReadingRail is the one client island on the
            template: where you are in a six-section document cannot be known at build time, and it
            derives its ticks from the rendered h2[id] so it cannot drift from the sections.

            `lg:mt-12` is the one piece of spacing this column needs and the grid cannot give it. The
            body grid carries no top margin because the lead column's first `Section` brings its own
            64/96; the aside has no such child, so it started flush against the bottom of the header,
            whose right cell ends in the banner. Card and banner touched on all 37 pages from lg up.
            48px is the gutter both grids already run between their columns, so the gap under the
            banner is the same rule as the gap beside it rather than a new number, and it is on the
            aside alone so the lead column's rhythm is untouched. Margin on the sticky element's
            containing block, not on the sticky element, so the card still pins below the bar. */}
        <aside className="hidden lg:col-span-4 lg:mt-12 lg:block">
          <div className="sticky top-[calc(var(--header-h)+3rem)] rounded-[14px] border border-line bg-surface p-6 shadow-card">
            {/* The service that fixes this error, named and linked: the card's own heading, and the
                third route out of the rail. Deliberately not the service rail's facts list
                (turnaround, price from): typicalTurnaround and priceFrom are null on all 32
                services, so that dl renders nothing on every route it already ships on. */}
            <Link
              href={parent.path}
              className="block font-display text-lg font-bold transition-colors duration-200 [font-variation-settings:'opsz'_18] hover:text-accent-text"
            >
              {parent.title}
            </Link>
            <div className="mt-5 grid gap-2">
              <BookLink location={`${loc}:rail`} service={parent.id} guide={g.slug} className="btn-primary w-full" />
              <ChatButton location={`${loc}:rail`} service={parent.id} className="btn-secondary w-full" />
            </div>
            {/* Last child, so the card grows downward into the empty column and nothing above it moves. */}
            <ReadingRail />
          </div>
        </aside>
      </div>

      {/* Outside the reading column, and the only section here that is. The page already spends a
          2-up grid on the causes, so a second one inside the same eight columns would be the same
          layout family twice (contract rule 3); four across on the full spine is a different thing,
          and four cards in a 720px well would be narrower than the error strings they carry. The h2
          still starts on the page's one left edge.

          The heading: it read "More wordpress critical error fix errors", because the parent's title
          is a service name and not a noun phrase that can be interpolated into a sentence. This is
          the heading the service page already gives the same list, which is a claim the site makes
          either way rather than a new one. */}
      {siblings.length > 0 && (
        <Section id="related-guides" title="Other errors we fix">
          <ErrorCards guides={siblings} />
        </Section>
      )}

      {/* The 37 guides were the one template with no closing band: they ended on the grid of sibling
          errors, which is a set of doors to more reading rather than a way out. "When to call us"
          and the rail both carry the pair higher up, but the rail is `lg`-only and sticky inside a
          grid the reader has already scrolled past by here. The heading names the parent service
          rather than the error, because the thing being offered is the fix, not the article. */}
      <ClosingBand
        title={CLOSING_ASK.BOOK}
        actions={
          <>
            <BookLink location={`${loc}:closing`} service={parent.id} guide={g.slug} className="btn-primary" />
            <ChatButton location={`${loc}:closing`} service={parent.id} className="btn-secondary" />
          </>
        }
      />
    </article>
  );
}
