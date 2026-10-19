import { WarningIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { faqLd, guideLd, JsonLd } from "@/components/JsonLd";
import { hasScreen, Photo } from "@/components/Photo";
import { routes } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { coreFileWarning } from "@/content/notices";
import { servicePhotos } from "@/content/photos";
import type { Guide } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, Faqs, LinkRows, RealScreen, Section, h1, page, pageY } from "./parts";
import { ReadingRail } from "./ReadingRail";

/**
 * The banner box: 336px from 1152 up (col-span-4 of a 12-column grid on a 1104px inner container
 * with 48px gutters), the full container width below 1024, and a real fraction in between, where
 * the container is still narrower than its max.
 *
 * It was col-span-5, 432px, which is the box the service hero measures. That was the wrong number
 * here for a structural reason: the header ran 7/5 over a body that runs 8/4, so the banner and the
 * rail card under it were two different widths sharing a right edge, and the right column stepped
 * 96px sideways between them. One grid, 8/4 in both, is what makes the two panels one column. The
 * reading column is unaffected at 720px either way, and the h1 now sits on the same 720px as the
 * document under it.
 *
 * The middle condition is not pedantry: measured at 1024 the box is 288px, and declaring the 1152
 * figure there costs a 2x tablet a candidate step. 30vw carries 3 to 7% of headroom across that
 * band, because under-declaring `sizes` is the failure that shows (a blurred LCP image) and
 * over-declaring is only bytes. Both figures describe the grid cell; the image inside it is 16px
 * narrower than the cell, because the frame holds it in `p-2`.
 */
const bannerSizes = "(min-width: 1152px) 336px, (min-width: 1024px) 30vw, 100vw";

/**
 * This page's own heading scale, one step under the shared inner h2 (26/32), set here as a scoped
 * descendant override rather than as a prop on `Section` so that `Faqs`'s heading moves with the
 * other five and no shared primitive changes signature. A guide is a reading document: against 17px
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
    <article data-urgency={g.urgency} className={cn(page, pageY, guideHeadings)}>
      <JsonLd data={[guideLd(g), faqLd(g.faqs)]} />
      <Breadcrumbs
        items={[
          { name: "Home", path: routes.home },
          { name: "Knowledge Base", path: routes.guides },
          { name: g.title, path: routes.guide(g.slug) },
        ]}
      />

      <header className="mt-6 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          {/* The headline paints at once: it is an LCP candidate, so it is one of the two things on
              the page that never fade in. */}
          <h1 className={h1}>{g.h1}</h1>
          {/* The machine's own words, one beat later, and the anchor of the page: this string is what
              the visitor pasted into a search box. Mono at 16px on the inset surface, not a thin
              14px line under the headline. It wraps rather than scrolls, so there is no scrollable
              region to strand a keyboard visitor in at 375, and anywhere is the only break rule that
              holds a 90-character file path inside the 720px column. The plate is sized to the string
              (`w-fit`, capped at the column): "502 Bad Gateway" in a 720px box read as an empty
              panel with a few characters in the corner. 20 of 37 guides have one. */}
          {g.errorText && (
            <p
              className="rise-in mt-7 w-fit max-w-full rounded-[14px] border border-line-strong bg-surface-2 px-5 py-4 font-mono text-[15px] leading-relaxed [overflow-wrap:anywhere] md:text-base"
              style={{ animationDelay: "70ms" }}
            >
              <code>{g.errorText}</code>
            </p>
          )}
        </div>
        <div className="lg:col-span-4">
          {/* The real capture of this error when one has been written, the parent service's own night
              frame until then (contract rule 7, docs/image-todo.md): the pattern the service hero
              already uses, which is what gives all 37 guides a banner rather than 4 of them. The
              photograph does not depict the error, so it carries no alt: g.image.alt describes a
              capture that does not exist on these pages, and using it would describe the wrong
              picture. Preloaded in both arms, faded in in neither. */}
          {hasScreen(`/screens/${g.image.slot}.png`) ? (
            <RealScreen slot={g.image.slot} alt={g.image.alt} sizes={bannerSizes} preload />
          ) : (
            // Same frame as the capture arm, and 16:10 because that is the photographs' own ratio
            // (1600x1000 in src/content/photos.ts), so the frame crops nothing. Deliberately not
            // "the same height as the capture": the four captures are 2.13, 1.78, 1.66 and 1.78,
            // measured from the files, so there is no single capture height to match. What is
            // constant across all 37 pages is the frame and the column, not the height.
            <figure className="overflow-hidden rounded-[14px] bg-surface-2 p-2">
              <div className="aspect-[16/10] overflow-hidden rounded-[14px]">
                <Photo id={servicePhotos[g.parentService]} decorative preload sizes={bannerSizes} />
              </div>
            </figure>
          )}
        </div>
      </header>

      {/* No top margin: the first Section's own 64/96 carries the gap, and the rail starts level with
          the body rather than 112px below the header. */}
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div data-rail-scope className="lg:col-span-8">
          <Section id="symptoms" title="What you are seeing">
            {/* Capped on the same measure as every paragraph on the page: the column is 720px, which
                is 88 characters of 17px Geist, and a symptom is a sentence. */}
            <ul className="ml-5 max-w-[68ch] list-disc space-y-2 text-muted marker:text-accent-text">
              {g.symptoms.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Section>

          <Section id="causes" title="What usually causes it">
            {/* Tiles, not a second bullet list: no layout family repeats on a page (contract rule 3). */}
            <ul className="grid gap-3 sm:grid-cols-2">
              {g.likelyCauses.map((x) => (
                <li key={x} className="rounded-[14px] border border-line bg-surface p-4 text-sm text-muted">
                  {x}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="safe-checks" title="Safe things to try first">
            <ol className="max-w-[68ch] space-y-4">
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

          <Section id="call-us" title="When to call us">
            <p className="max-w-[68ch] text-muted">{g.whenToCallUs}</p>
            <p className="mt-4">
              How we fix it:{" "}
              <Link href={parent.path} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
                {parent.title}
              </Link>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookLink location={`${loc}:call-us`} service={parent.id} guide={g.slug} className="btn-primary" />
              <ChatButton location={`${loc}:call-us`} service={parent.id} className="btn-secondary" />
            </div>
            <p className="mt-4 text-sm text-muted">
              Nothing down right now? <CheckLink location={`${loc}:call-us`} service={parent.id} />
            </p>
          </Section>

          <Faqs faqs={g.faqs} />

          {siblings.length > 0 && (
            // It read "More wordpress critical error fix errors": the parent's title is a service
            // name, not a noun phrase that can be interpolated into a sentence. It is the heading
            // the service page already gives this same list of guides, which is a claim the site
            // makes either way rather than a new one.
            <Section id="related-guides" title="Other errors we fix">
              <LinkRows items={siblings.map((x) => ({ href: routes.guide(x.slug), title: x.title, summary: x.symptoms[0] }))} />
            </Section>
          )}
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
            containing block, not on the sticky element, so the card still pins at `top-28`. */}
        <aside className="hidden lg:col-span-4 lg:mt-12 lg:block">
          <div className="sticky top-28 rounded-[14px] border border-line bg-surface p-6 shadow-card">
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
    </article>
  );
}
