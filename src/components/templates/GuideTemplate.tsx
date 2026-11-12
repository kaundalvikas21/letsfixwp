import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { faqLd, guideLd, JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { TiltSlab } from "@/components/motion/interactions/TiltSlab";
import { hasScreen } from "@/components/Photo";
import { CauseTable } from "@/components/sections/v4/guide/CauseTable";
import { SafeStairs } from "@/components/sections/v4/guide/SafeStairs";
import { SymptomCheck } from "@/components/sections/v4/guide/SymptomCheck";
import { CLOSING_ASK } from "@/config/cta";
import { routes } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { hubIcon } from "@/content/icons";
import { coreFileWarning } from "@/content/notices";
import { servicePhotos } from "@/content/photos";
import type { Guide } from "@/content/schema";
import { cn, leadSentence } from "@/lib/utils";
import { card, ClosingBand, ErrorCards, Faqs, PageMasthead, Section, page, pageYMasthead } from "./parts";
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
  const captured = hasScreen(`/screens/${g.image.slot}.png`);
  const [stopIf, why] = leadSentence(g.whenToCallUs);
  const Mark = hubIcon[parent.hub as keyof typeof hubIcon];

  return (
    <article id="guide-article" data-urgency={g.urgency} className={cn(page, pageYMasthead)}>
      <JsonLd data={[guideLd(g), faqLd(g.faqs)]} />

      {/* The 8/4 split is gone. The parent service's night frame was a 336px panel in the right-hand
          four columns and is the band itself now, which is the shape every inner page here runs. The
          error string moves onto it: the h1 says which error this is and the plate under it is the
          error, so the two belong in one box.

          The band's own background is the real capture on the four guides that have one, and the
          parent service's night frame on the other 33. The capture is the picture of the error, so
          it belongs behind the error string: the same image the home page's critical tiles already
          run as a tile background, under the same flat scrim. Both arms are decorative and carry no
          alt, because the h1 and the plate under it say what the reader is looking at. */}
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
        lead={g.seo.description}
        actions={
          <>
            <BookLink location={`${loc}:hero`} service={parent.id} guide={g.slug} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} service={parent.id} className="btn-secondary" />
          </>
        }
        screen={captured ? `/screens/${g.image.slot}.png` : undefined}
      />

      {/* No top margin: the first Section's own 64/96 carries the gap, and the rail starts level with
          the body rather than 112px below the header. */}
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-rail-scope className={cn("lg:col-span-8", guideHeadings)}>
          {/* The four sections below are the guide's argument, each with its own picture and its own
              3D motif (docs/layout-ledger.md Task 89): recognise it, see where it lives, try the
              safe things in order, know where to stop. Reveals sit on wrappers throughout, because
              the reveal pins `transform` and every 3D motif here is made of it. */}
          <Section id="symptoms" title="What you are seeing">
            {/* A check the reader runs, at the full measure. The real capture used to sit beside it
                on the four guides that have one; it is on the masthead now, next to the error string
                it is a picture of. */}
            <Reveal>
              <SymptomCheck items={g.symptoms} />
            </Reveal>
          </Section>

          <Section id="causes" title="What usually causes it">
            <CauseTable causes={g.likelyCauses} />
          </Section>

          <Section id="safe-checks" title="Safe things to try first">
            <SafeStairs checks={g.safeChecks} warning={coreFileWarning} />
          </Section>

          {/* Still one panel on the card tokens with the argument above the hairline and the hand-off
              below it. The argument is split: its first sentence is the stop condition and is set as
              the lead, the rest is why, muted. The slab beside it is the hand-off made solid, carrying
              the mark of the service that does the fix; from 768px only, because under that the
              panel is a single column and the slab would push the buttons a screen down.

              The h2 stays outside the panel. It belongs to the document outline, and `ReadingRail`
              derives its ticks from `h2[id]` inside the reading column. */}
          <Section id="call-us" title="When to call us">
            <div className={cn(card, "reveal-self overflow-hidden p-6 md:p-8")}>
              <div className="md:grid md:grid-cols-12 md:items-center md:gap-8">
                <div className="md:col-span-8">
                  <p className="font-display text-xl leading-snug font-bold [font-variation-settings:'opsz'_20] md:text-[1.375rem] md:[font-variation-settings:'opsz'_22]">
                    {stopIf}
                  </p>
                  {why && <p className="mt-3 max-w-[60ch] text-muted">{why}</p>}
                  <p className="mt-4 text-[15px]">
                    How we fix it:{" "}
                    <Link href={parent.path} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
                      {parent.title}
                    </Link>
                  </p>
                </div>
                <div className="hidden md:col-span-4 md:block">
                  <TiltSlab>
                    <Mark weight="duotone" className="size-11" />
                  </TiltSlab>
                </div>
              </div>

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
                  Nothing down right now?{" "}
                  <CheckLink
                    location={`${loc}:call-us`}
                    service={parent.id}
                    icon={null}
                    className="font-semibold text-text underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
                  />
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
