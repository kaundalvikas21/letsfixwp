import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Icon } from "@phosphor-icons/react";
import { CaretDownIcon, CaretRightIcon, CheckIcon, WarningIcon, WarningOctagonIcon, WrenchIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import { Stagger } from "@/components/motion";
import { Photo } from "@/components/Photo";
import { sharedOpenGraph } from "@/config/brand";
import { nodeByPath, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getCompare, getGuide, getService } from "@/content";
import type { Guide, Service } from "@/content/schema";
import { deliveryIcon, promiseIcon, verbIcon } from "@/content/icons";
import { promises, remoteDelivery } from "@/content/notices";
import { deliveryPhoto, type PhotoId } from "@/content/photos";
import { pngSize } from "@/lib/png-size";
import { ClosingBeams } from "./ClosingBeams";
import { cn } from "@/lib/utils";

// Template primitives for the active variation. Visual language from design-system/letsfixwp-v4/MASTER.md:
// dark locked, one ember accent, 14px on everything, Bricolage Grotesque display over Geist body, Geist Mono
// for error strings only. Density 3, so sections breathe further apart than they did on v3.

export const page = "mx-auto w-full max-w-page px-4 md:px-6";
/**
 * Every page's own top and bottom padding, and the header is part of it.
 *
 * The bar is `fixed` and 64px tall, so a page that starts at the top of the document starts
 * underneath it. Each page was carrying `py-8 md:py-12`, which is 32 and 48: less than the header
 * on both, so the first 32px of every stacked page and the first 16px of every desktop one were
 * behind the bar, which is where the breadcrumb lives. 96 and 112 are the same 32 and 48 those
 * pages were always asking for, with the 64 they have to clear added on. One constant rather than
 * thirteen literals, so the next page cannot quietly reintroduce it.
 */
export const pageY = "pt-[calc(var(--header-h)+2rem)] pb-8 md:pt-[calc(var(--header-h)+3rem)] md:pb-12";

/**
 * For a page whose first element is a full-bleed masthead, which is the eight template families that
 * render one.
 *
 * `pageY` clears the 64px bar and then adds the page's own 32 and 48 of breathing room on top of it,
 * which is right when the first thing under the header is text. A band is not text. That breathing
 * room rendered as a 32px strip of `--bg` at base and 48px at desktop between the bar and the
 * picture, which reads as a seam rather than as spacing, and it only became visible once the band
 * went full bleed in Task 67: inside the spine it looked like the gutter continuing.
 *
 * This is the bar's height exactly and nothing else, so the band's top edge meets the bar's bottom
 * edge. The band carries its own `py-6 sm:py-10 md:py-14 lg:py-16`, which is what keeps the
 * breadcrumbs off the bar now that they sit inside it.
 */
export const pageYMasthead = "pt-[var(--header-h)] pb-8 md:pb-12";
export const prose = "max-w-[68ch] text-muted";
export const h1 =
  "font-display text-[2.125rem] leading-[1.05] font-extrabold tracking-[-0.04em] text-balance [font-variation-settings:'opsz'_34] sm:text-5xl sm:[font-variation-settings:'opsz'_48] lg:text-[3.5rem] lg:[font-variation-settings:'opsz'_56]";
/**
 * Deliberately quieter than a home section heading (30 to 48), because an inner h2 is subordinate to
 * a 56px h1 and must not shout across a seven-section reading page. What was missing was the optical
 * axis: every other display string on the site steps `opsz` with its own size (h1 runs 34/48/56) and
 * this one set none, so Bricolage rendered a 24px heading at its default optics and read as a
 * different face from the h1 above it.
 */
export const h2 =
  "font-display text-[1.625rem] leading-[1.15] font-extrabold tracking-[-0.04em] [font-variation-settings:'opsz'_26] md:text-[2rem] md:[font-variation-settings:'opsz'_32]";
export const card = "rounded-[14px] border border-line bg-surface p-6 shadow-card";
/**
 * `card` for a card that is a link, which is the only thing on this site allowed to lift.
 *
 * Hover earns it: `--shadow-lift` is reserved for a link answering the pointer, so the border
 * firming to `--line-strong` and the shadow stepping up are the whole affordance. Both are gated
 * behind `(hover: hover)` because a tap on a phone leaves a `:hover` state lit with no way to
 * clear it, and the transition names its two properties rather than `all` so nothing else on the
 * card can quietly join in. Nothing here changes a box size, so a lift never shifts the grid.
 *
 * Lifted verbatim out of HubTemplate's problem grid, which hand-rolled it as the branch's only
 * interactive card. The hub now imports it, so there is one string instead of two.
 */
export const cardLink = cn(
  "group relative block rounded-[14px] border border-line bg-surface p-5 shadow-card",
  // `translate` is in the list because a `card-plate` wrapper slides this card off its plate on
  // hover, and Tailwind v4 writes that movement to the standalone `translate` property rather than
  // to `transform`. Naming it here costs nothing on a card that is never wrapped.
  "transition-[border-color,box-shadow,translate] duration-200 motion-reduce:transition-none",
  "[@media(hover:hover)]:hover:border-line-strong [@media(hover:hover)]:hover:shadow-lift",
);

/**
 * Metadata for a content page: the service, guide, city and comparison routes, which is most of the
 * site.
 *
 * `sharedOpenGraph` is spread rather than assumed. Next merges metadata shallowly from the root
 * layout down, so this object **replaces** the root layout's `openGraph` instead of merging into it,
 * and any key not restated here is dropped. Before the spread, `og:site_name` and `og:locale` were
 * missing from 80 of the 98 prerendered pages, which is every page that calls this.
 */
export const pageMetadata = (seo: { title: string; description: string }, path: string): Metadata => ({
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: path },
  openGraph: { ...sharedOpenGraph, title: seo.title, description: seo.description, url: path },
});

export function Section({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    // 64/96 is exactly half the home page's 128/192 between-section value: the same system at half
    // density, which is what a seven-section reading document wants. It was 56/80 against a 24px
    // heading-to-body gap, which at 375 let adjacent sections merge into one another.
    <section aria-labelledby={id} className={cn("mt-16 md:mt-24", className)}>
      <h2 id={id} className={cn("reveal-self", h2)}>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}


/**
 * Every inner page's header: the type sits on the photograph, which is what a masthead is, rather
 * than in a block with a picture parked beside it.
 *
 * This is the shape /about/ and /pricing/ already proved and the shape `FinalCta` uses, so nothing
 * about it is new. It is the page's one `relative isolate` box, with the photograph and the scrim
 * both at `-z-10` and the type in normal flow above them.
 *
 * Three rules it exists to hold in one place rather than on five templates:
 *
 * - **Height comes from the content plus its padding, never an aspect ratio.** At 375 a 16/9 band
 *   is 211px and an h1, a sentence and two buttons need more than 300px, so an aspect-driven box
 *   would have type overflowing the frame it is supposed to sit inside. `minH` is the opposite
 *   guard, holding enough frame open at desktop that the photograph still reads as a photograph.
 * - **The scrim is the flat token, never a gradient.** `bg-photo-scrim` is `rgb(12 12 14 / 0.66)`,
 *   measured at 6.58:1 for `--on-photo` against the brightest pixel a photograph here can hold.
 *   Which is why `lead` is `text-on-photo` and never `text-muted`: muted over this same scrim is
 *   2.55:1 and fails the moment the type moves onto the picture.
 * - **The h1 never animates.** It is the LCP element on every one of these routes. The lead arrives
 *   70ms behind it and the actions 140ms, which is the beat every header on the site already runs,
 *   and `rise-in` collapses to the final state under reduced motion.
 */
export function PageMasthead({
  title,
  lead,
  photo,
  crumbs,
  decorative = true,
  plate,
  actions,
  screen,
  minH = "md:min-h-[24rem]",
  className,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  photo: PhotoId;
  /** Rendered on the photograph at the band's top edge. Omit on a page that has no breadcrumbs. */
  crumbs?: Crumb[];
  /**
   * Decorative by default: on these pages the h1 and the lead already say what the page is, so the
   * frame beside them only sets mood. Pass `false` where the picture is content in its own right
   * and no sentence near it describes it, which is the case /about/ makes for itself.
   */
  decorative?: boolean;
  /** The literal string the owner is staring at, in the one typeface allowed to carry it. */
  plate?: string;
  actions?: React.ReactNode;
  /**
   * A real capture under `public/screens/`, which takes the place of `photo` as the band's own
   * background. The guides pass theirs: the picture of the error is the error, so it belongs behind
   * the error string rather than in a panel over the band or two sections down the page. It is the
   * same image, used the same way, as a critical tile on the home page's problem grid.
   *
   * It composites under the same flat `--photo-scrim`, which is what keeps the type legal over it:
   * at 0.66 over a pure white capture (the worst case this site has) `--on-photo` measures 5.7:1.
   */
  screen?: string;
  minH?: string;
  className?: string;
}) {
  // 70ms per element that actually renders, not per slot: the service and city bands carry a
  // headline and buttons and no lead, and a fixed "buttons at 140ms" left them waiting out a beat
  // nothing filled. Counted here in plain statements rather than by a closure called from the JSX,
  // which is a reassignment after render and which the compiler lint rejects outright.
  let beats = 0;
  const plateDelay = plate ? ++beats * 70 : 0;
  const leadDelay = lead ? ++beats * 70 : 0;
  const actionsDelay = actions ? ++beats * 70 : 0;

  return (
    <header
      className={cn(
        // Full bleed: the photograph and its scrim run to both window edges while the words stay on
        // the spine, in the inner `page` wrapper below. The radius and `shadow-card` went with the
        // card shape, because a band that meets the window has no corners to round and no edge for
        // a card shadow to sit on; the home hero has been unrounded for the same reason since
        // Task 25. Vertical padding stays on this element and the horizontal padding is the spine's.
        "full-bleed relative isolate flex flex-col overflow-hidden py-6 sm:py-10 md:py-14 lg:py-16",
        minH,
        className,
      )}
    >
      {/* `100vw` now that the band is the window's width, not the spine's. `hero-settle` eases it
          from 1.06 to its own box over 1.2s on load: scale only, cropped by this header's
          overflow, and gone entirely under reduced motion. */}
      {screen ? (
        // Decorative, with no alt: the h1 and the error plate under it already say what this is a
        // picture of, and `g.image.alt` describes it as an inline figure rather than as a backdrop.
        <Image src={screen} alt="" fill preload sizes="100vw" className="hero-settle -z-10 object-cover" />
      ) : (
        <Photo id={photo} decorative={decorative} preload sizes="100vw" className="hero-settle absolute inset-0 -z-10" />
      )}
      <span aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />

      {/* The breadcrumbs sit on the photograph, at the band's top edge, and the headline block is
          pushed to the foot by `mt-auto`. They used to sit above the band on the page background,
          which left a strip of empty page between the header bar and the hero and gave the band no
          top edge of its own to hold. On the image they need the photo tone: see `Breadcrumbs`. */}
      {crumbs && (
        <div className={page}>
          <Breadcrumbs items={crumbs} tone="photo" />
        </div>
      )}

      {/* `my-auto`, not `mt-auto`. The band has a min-height and most pages do not fill it, and with
          the slack all on one side it landed in a single place: between the breadcrumbs and the h1,
          where it read as a hole rather than as spacing, and it measured differently on every page
          because it is whatever that page's content does not use. Split in two it is top and bottom
          padding around the words, which is what it looks like, and the crumb-to-headline gap is the
          40px below within about 8px on every route. */}
      <div className={cn(page, "my-auto", crumbs && "pt-10")}>
        <h1 className={h1}>{title}</h1>
      {/* The machine's own words, and the anchor of the page: this string is what the visitor pasted
          into a search box. Mono on the inset surface, which is opaque, so its contrast is the
          token table's `--text` on `--surface-2` and not the scrim's. It wraps rather than scrolls,
          so there is no scrollable region to strand a keyboard visitor in at 375, and `anywhere` is
          the only break rule that holds a 90-character file path inside the band. Sized to the
          string, because "502 Bad Gateway" in a 1152px box read as an empty panel with a few
          characters in the corner. */}
        {plate && (
          <p
            className="rise-in mt-6 w-fit max-w-full rounded-[14px] border border-line-strong bg-surface-2 px-5 py-4 font-mono text-[15px] leading-relaxed [overflow-wrap:anywhere] md:text-base"
            style={{ animationDelay: `${plateDelay}ms` }}
          >
            <code>{plate}</code>
          </p>
        )}
        {lead && (
          <p className="rise-in mt-5 max-w-[60ch] text-lg text-on-photo" style={{ animationDelay: `${leadDelay}ms` }}>
            {lead}
          </p>
        )}
        {actions && (
          <div className="rise-in mt-7 flex flex-wrap gap-3" style={{ animationDelay: `${actionsDelay}ms` }}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * The last thing every reading page says, and now the only place it is written.
 *
 * Eight pages carried this markup byte for byte: the same section class string, the same heading
 * measure, the same `shrink-0 flex-wrap gap-3` pair of buttons, differing only in the heading, the
 * id and whether the measure was 24, 26 or 28ch. Eight copies of one band is eight places for it to
 * drift, and two of them had already drifted on the `location` string they report to `track()`.
 *
 * It is a split band and not a centred panel on purpose: centred is the home page's final CTA
 * family, and contract rule 3 forbids a family repeating within a page but expects this one to
 * repeat across routes. The last thing every reading page says should be the same shape every time;
 * that is the point of it, not a failure of variety.
 *
 * `id` defaults to "closing" because a page has exactly one, and a per-page id was the only thing
 * these eight did not share. Nothing anchors to the old ones (checked across src and docs).
 *
 * **It is a panel now, not a hairline.** It was a top rule with a heading on one side and two
 * buttons on the other, which at the foot of a long page read as a divider that happened to have
 * controls near it rather than as the page's offer. The panel is the same surface, border, radius
 * and `--shadow-card` every other card on this site uses; what makes it the loudest card on the
 * page is its padding and the fact that nothing else sits at that width.
 *
 * The lit top edge inside `--shadow-card` is doing the real work here. MASTER calls it the main
 * device of this variation, a 5% white inset that reads as an edge catching light in a dark room,
 * and on a box this large it is the difference between a panel and a grey rectangle.
 *
 * The ember rule above the heading is the site's existing mark, the same short accent tick the
 * about page's rail and the practice rows use. One accent, used once, as punctuation rather than
 * as decoration: it says the page has arrived somewhere.
 */
export function ClosingBand({
  id = "closing",
  title,
  actions,
  measure = "max-w-[24ch]",
}: {
  id?: string;
  title: React.ReactNode;
  actions: React.ReactNode;
  /** The heading's own cap in ch. Two pages set a longer one because their heading is a question. */
  measure?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className="closing-band relative isolate mt-20 overflow-hidden rounded-[14px] border border-line bg-surface p-8 shadow-card md:mt-28 md:p-12"
    >
      {/* The beams. `-z-10` inside the section's own `isolate`, so they paint above `bg-surface` and
          below every child in flow, and `overflow-hidden` is what makes the 14px radius clip them.
          Decoration: `aria-hidden`, no pointer events. This replaced a CSS line grid (Task 42) on
          the owner's instruction; everything about how the artwork is built lives on the component. */}
      <ClosingBeams />
      {/* A 7/5 grid, not a flex row with `justify-between`. The flex version let the heading set the
          gap, so a 24ch question and a 28ch one put the buttons in two different places and the
          band looked slightly different on every template. On a grid the actions sit on one column
          edge on all 99 routes, which is the whole point of there being one component. */}
      <div className="reveal grid gap-8 md:grid-cols-12 md:items-center md:gap-12">
        <div className={cn("md:col-span-6", measure)}>
          {/* Sized by the column rather than given a width of its own, so the rule it runs out to
              is exactly the measure the heading wraps at. */}
          <span aria-hidden className="closing-tick" />
          <h2 id={id} className={cn(h2, "mt-5")}>
            {title}
          </h2>
        </div>
        {/* Six columns, not five, and `md:flex-nowrap` with it. At 1440 the panel's inner width is
            about 1008px, so a five-column track is ~395px and the widest pair the site has (BOOK at
            ~150px beside CHAT at ~243px, plus the gap) needs ~405: the buttons wrapped into a
            stack on every page. Six gives ~480 and the pair sits on one line at every intent. */}
        <div className="flex flex-wrap gap-3 md:col-span-6 md:flex-nowrap md:justify-end">{actions}</div>
      </div>
    </section>
  );
}

/**
 * `tone` is a union and not a boolean, which is the rule this file already carries on `plate`: two
 * named states rather than a flag that invites a third.
 *
 * **Why the photo tone cannot just dim the base colour.** `--on-photo` and `--text` are the same
 * value, so the page tone's trick of lifting the current crumb from `--muted` to `--text` has no
 * equivalent on an image: both ends would be the same white. And `--muted` over `--photo-scrim`
 * measures 2.55:1, the pairing `PageMasthead` already records as failing. So on a photograph every
 * crumb is `--on-photo` at 6.58:1 and the current page is marked by weight, with links underlining
 * on hover rather than changing colour. Ember was not an option either: `--accent-text` over this
 * scrim is 2.76:1.
 */
export function Breadcrumbs({ items, tone = "page" }: { items: Crumb[]; tone?: "page" | "photo" }) {
  const onPhoto = tone === "photo";
  return (
    <>
      <JsonLd data={breadcrumbLd(items)} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", onPhoto ? "text-on-photo" : "text-muted")}>
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {items.map((c, i) => (
            <li key={c.path} aria-current={i === items.length - 1 ? "page" : undefined} className="flex items-center gap-1">
              {i > 0 && <CaretRightIcon weight="duotone" className="size-3.5 shrink-0" aria-hidden />}
              {i === items.length - 1 ? (
                <span className={onPhoto ? "font-semibold" : "text-text"}>{c.name}</span>
              ) : (
                // py-1.5 takes the crumb from a 20px tap target to 32px, which clears WCAG 2.5.8's
                // 24px floor; it was the smallest target on the site and the one axe does not flag.
                // Deliberately not the contract's 44: a 44px row of 14px crumbs reads as a second
                // nav bar under the real one, and the same trade is already recorded for the footer.
                // Vertical padding only, so the first crumb's left edge stays on the page spine.
                // Nothing more than a colour fade: orientation furniture that performs is furniture
                // competing with the page.
                <Link
                  href={c.path}
                  className={cn(
                    "inline-flex items-center py-1.5 transition-colors duration-150",
                    onPhoto ? "hover:underline hover:underline-offset-4" : "hover:text-text",
                  )}
                >
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Plain disclosure list: no JS, and deliberately not the home page's tabbed Motion accordion. */
export function Faqs({ faqs, title = "Questions" }: { faqs: { q: string; a: string }[]; title?: string }) {
  return (
    <Section id="faq" title={title}>
      <div className="reveal divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          // The question is a real heading. It was display type inside a bare summary, so the same
          // content had a proper outline on the home page's FaqTabs and a flat one on every
          // template route. summary's content model allows heading content intermixed with phrasing.
          // The padding belongs to the summary, not to the details around it: summary is the click
          // target, and with the padding one level up it was a 28px row inside a 60px box, under the
          // 44px the contract asks for. Same rendered height, a target you can actually hit.
          <details key={f.q} className="faq-row group">
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
              <h3 className="font-display text-lg font-bold [font-variation-settings:'opsz'_18]">{f.q}</h3>
              {/* CaretDown turning 180, which is the gesture and the mark the home FAQ already uses.
                  CaretRight turning 90 was a second vocabulary for one move; `LinkCards` keeps
                  CaretRight, so "go there" and "open this" are two marks on purpose. */}
              <CaretDownIcon
                weight="duotone"
                // transition-[rotate,...], not transition-[transform,...]: Tailwind v4 writes
                // rotate-180 to the standalone `rotate` property, so naming `transform` transitions
                // nothing and the caret snaps while the colour fades. Measured in the browser.
                className="size-5 shrink-0 text-muted transition-[rotate,color] duration-[240ms] ease-[var(--ease-spring)] group-open:rotate-180 group-open:text-accent-text motion-reduce:transition-none"
                aria-hidden
              />
            </summary>
            <p className="max-w-[70ch] pb-4 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/**
 * The promises tick list, for /legal/guarantee/ and /pricing/. /contact/ draws the same sentences as
 * `PromiseFlow`.
 *
 * Each route used to state the same four commitments from its own copy of the array and its own copy
 * of this markup, which is how two promises drift into two different promises. The sentences are
 * the owner's approved wording and live in src/content/notices.ts; nothing here edits them, and
 * `first-letter:uppercase` is presentation only. A row renders only while its own claim is truthy,
 * because an unconfirmed claim is null.
 *
 * Not `TickList`: that one takes any strings and gives them no measure, and these need the claim
 * gate and the capital.
 */
export function Promises({ className }: { className?: string }) {
  return (
    <ul className={cn("reveal grid gap-3", className)}>
      {promises
        .filter(([confirmed]) => confirmed)
        .map(([, words]) => (
          <li key={words} className="flex gap-3">
            <CheckIcon weight="duotone" className="mt-1 size-5 shrink-0 text-accent-text" aria-hidden />
            <span className="block max-w-[60ch] first-letter:uppercase">{words}</span>
          </li>
        ))}
    </ul>
  );
}

/**
 * `animate` exists for one caller and defaults to the behaviour every other caller already had.
 *
 * This list carries its own `reveal`, which is right wherever it is the only animated thing in its
 * section. On `/pricing/` it is not: the three ways rows wanted a marker of their own, and a
 * `reveal` inside a `reveal` is two levels, which `docs/layout-ledger.md` rules out in one line,
 * "one level per section, never nested, so nothing animates twice". That page passes
 * `animate={false}` and tags the list above instead. `ServiceTemplate` and every other caller pass
 * nothing and render exactly as before.
 */
export function TickList({ items, cols = 1, animate = true }: { items: readonly string[]; cols?: 1 | 2; animate?: boolean }) {
  return (
    <ul className={cn(animate && "reveal", "grid gap-3", cols === 2 && "sm:grid-cols-2 sm:gap-x-8")}>
      {items.map((x) => (
        <li key={x} className="flex gap-3">
          <CheckIcon weight="duotone" className="mt-1 size-5 shrink-0 text-accent-text" aria-hidden />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Does your site show this?" on a fix-intent service page: one enclosed panel of divided rows.
 *
 * It was `TickList`, which is still what the deliverables section below is, so the two read as one
 * column of sentences with a heading dropped into the middle of it (docs/layout-ledger.md, Task 73).
 * A continuous ruled rail is a family this page does not otherwise carry: `Faqs` is borderless and
 * its rows open, and `WorkFlow` is a flow with a connecting line and no panel around it.
 *
 * A rail rather than cards on purpose, and that is what now separates this from the tick list under
 * "What you get". These are symptoms a reader scans for their own, so the job is a fast vertical
 * read down one edge, and separated cards would put a gap and two borders between every line of it.
 * The deliverables were built as cards and as a rail during this task and the owner kept neither;
 * both shapes are described in the ledger if they are ever wanted again.
 *
 * `WarningIcon` rather than the tick `TickList` draws. Every string here names something broken, and
 * a tick against "wp-admin will not load" reads as the opposite of what the row says. Still ember,
 * like the deliverables' tick, so the two sections are told apart by shape and not by hue, which is
 * the same reasoning `urgencyIcon` records below.
 *
 * `overflow-hidden` is load-bearing rather than tidy: without it the first and last row's hover tint
 * paints square corners over the panel's 14px radius.
 *
 * The hover is a tint and nothing else. MASTER.md keeps lifting for `cardLink`, "the only thing on
 * this site allowed to lift", and bans hover scales on cards that are not links. These rows are not
 * links and cannot become them: there is no per-row destination anywhere in the content.
 */
export function SymptomPanel({ items }: { items: readonly string[] }) {
  return (
    <ul className="reveal divide-y divide-line overflow-hidden rounded-[14px] border border-line bg-surface shadow-card">
      {items.map((x) => (
        <li
          key={x}
          className="flex gap-3.5 px-5 py-4 transition-colors duration-[var(--motion-duration-small)] ease-[var(--motion-ease)] md:px-6 md:py-5 [@media(hover:hover)]:hover:bg-surface-2"
        >
          <WarningIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
          <span className="max-w-[60ch]">{x}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * "What we do" on a service page: the steps as one connected flow, ending on the only filled block.
 *
 * It was a 2-up grid of near-identical tiles, so five steps in a fixed order read as five unrelated
 * facts (docs/layout-ledger.md, Task 77). Vertical because the text decides it: `detail` runs to 169
 * characters in a 736px column, and five across would give each about 130px and ten lines.
 *
 * The rotation lives on an inner element and never on the `li`. The reveal holds `transform: none`
 * on every child of its container under `fill: both`, so a transform on the `li` would be overwritten
 * for good the moment the row arrived.
 *
 * Nothing is numbered, because the line already gives the order (contract rule 6), and the `ol` gives
 * it to a screen reader. There is no hover: these rows hold no links, and Hover Earns It forbids hover
 * on a panel that is not interactive. The connector sits inside each row, so the line grows row by row
 * as they arrive.
 */
export function WorkFlow({ steps }: { steps: Service["whatWeDo"] }) {
  return <FlowList rows={steps.map((w) => ({ key: w.verb, mark: verbIcon[w.verb as keyof typeof verbIcon], title: w.verb, text: w.detail }))} />;
}

/**
 * The four promises on /contact/, drawn as the order they happen in rather than as a tick list.
 *
 * Same gate as `Promises`: a claim that is not confirmed removes its row, and the last row left takes
 * the ember block. The words are the owner's and are never reworded, so there is no title here.
 */
export function PromiseFlow() {
  const rows = promises.filter(([confirmed]) => confirmed).map(([, words, key]) => ({ key, mark: promiseIcon[key], text: words }));
  return <FlowList rows={rows} compact />;
}

/**
 * `compact` keeps the small block at every width, for a panel that is narrow even on a wide screen.
 * The last row is the only ember one, wherever the list happens to end.
 */
function FlowList({ rows, compact = false }: { rows: { key: string; mark: Icon; title?: string; text: string }[]; compact?: boolean }) {
  const items = rows.map(({ key, mark: Mark, title, text }, i) => {
        const end = i === rows.length - 1;
        return (
          <li key={key} className={cn("relative grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 last:pb-0", compact ? "pb-2" : "pb-9 md:grid-cols-[7.5rem_minmax(0,1fr)] md:gap-x-6")}>
            <div aria-hidden className={cn("flex h-[4.25rem] justify-center pt-2", !compact && "md:h-[5.25rem]")}>
              <span data-end={end ? "" : undefined} data-compact={compact ? "" : undefined} className="flow-block">
                <Mark weight="duotone" />
              </span>
            </div>
            {!end && <span aria-hidden className={cn("absolute top-[4.25rem] -bottom-2 left-[2.75rem] w-px bg-line-strong", !compact && "md:top-[5.25rem] md:left-[3.75rem]")} />}
            {title ? (
              <div className="pt-1">
                <h3 className="font-display text-lg leading-snug font-bold [font-variation-settings:'opsz'_18] md:text-xl md:[font-variation-settings:'opsz'_20]">{title}</h3>
                <p className="mt-1 max-w-[60ch] text-muted">{text}</p>
              </div>
            ) : (
              <p className="self-center text-[15px] leading-snug first-letter:uppercase">{text}</p>
            )}
          </li>
        );
      });
  // No reveal when compact: that list lives in a sticky column, where its lowest rows can stop below
  // the reveal's trigger line and stay invisible. Its card brings the whole list in on load instead.
  return compact ? <ol>{items}</ol> : <Stagger as="ol">{items}</Stagger>;
}

/**
 * Link rows: title, optional summary, chevron. Used for service and guide directories.
 *
 * The row is a grid rather than a flex pair so that `split` can move the summary into a column of
 * its own from md up without a second component: title, summary and chevron are already three cells
 * and the variant only re-places them. Default is the stacked row every existing call site renders
 * today (title, summary under it, chevron right), which is why `split` is opt-in rather than a
 * changed default.
 *
 * `split` is for a hub directory, where eleven stacked title-over-paragraph rows read as one block
 * of text: with the summary in its own column the titles form a single scannable column on the page
 * spine and the summaries answer them across the gutter.
 */
/**
 * One destination in a `LinkCards` grid.
 *
 * `code` is the literal string WordPress prints, and the one place this variation allows mono.
 * `icon` is a Phosphor component, which is the only icon set on the site; it is the card's whole
 * semantic mark, so it is keyed to something real about the destination (a guide's `urgency`) and
 * never picked for decoration.
 */
export type LinkCardItem = { href: string; title: string; summary?: string; code?: string; icon?: Icon; banner?: PhotoId };

/**
 * A guide's mark, keyed to the one field that already ranks it.
 *
 * `urgency` sorts the hub's problem grid and decides which panel takes the full width there, so it
 * is a real property of the error rather than a label invented for the card. The word itself is
 * never printed: three shapes carry it, and a card under "Errors we fix here" that also spelled out
 * "critical" would be restating its own position in the list. One accent, so all three are ember;
 * the octagon, the triangle and the wrench differ in shape, not in hue, which is what keeps this
 * from being a colour-only indicator.
 */
export const urgencyIcon = {
  critical: WarningOctagonIcon,
  high: WarningIcon,
  standard: WrenchIcon,
} as const satisfies Record<"critical" | "high" | "standard", Icon>;

/**
 * The error grid, under "Errors we fix here" on a service page and "Other errors we fix" on a guide.
 *
 * It exists for the mapping. Turning a guide into a card is five lines, and they were typed out
 * identically in both templates: the route, the title, the first symptom, the literal error string
 * and the urgency mark. One component holds them now.
 *
 * It used to carry a second job, opting this grid into the backing plate while four other sections
 * went without. That job is gone: the plate is what every link card does (Task 61), so there is no
 * flag here and nothing to opt into.
 */
export function ErrorCards({ guides }: { guides: Guide[] }) {
  return (
    <LinkCards
      cols={4}
      items={guides.map((g) => ({
        href: routes.guide(g.slug),
        title: g.title,
        summary: g.symptoms[0],
        code: g.errorText,
        icon: urgencyIcon[g.urgency],
      }))}
    />
  );
}

/**
 * The hub's service directory, under "What we do here".
 *
 * Like `ErrorCards`, this is here for the mapping and nothing else. A node rather than a `Service` is
 * the input, because a hub's child nodes carry their own `title` and `path` and those are what the
 * directory links; the service is looked up only for its summary.
 *
 * The city page lists services too, but from `Service` objects rather than hub nodes, so it keeps its
 * own `LinkCards` call. That costs it nothing now that the plate is universal (Task 61); it was the
 * difference between a treated grid and a plain one only while the flag existed.
 */
export function ServiceCards({ nodes }: { nodes: FlatNode[] }) {
  return (
    <LinkCards
      cols={4}
      items={nodes.map((n) => ({
        href: n.path,
        title: n.title,
        summary: getService(serviceIdOf(n.path))?.summary,
      }))}
    />
  );
}

/**
 * A directory of links as a grid of cards, each one a door to its own page.
 *
 * It replaces the ruled rows these sections used to render. A row works for a list that is read in
 * order; every one of these items is a separate page, and a card is what a reader scans when the
 * question is "which of these is mine". The ember hairline the rows used is gone with them: a card
 * that lifts does not also need a rule drawn under it.
 *
 * **Never three across** (contract rule 6). `cols` is 2 or 4 for that reason, so the ban needs no
 * special-casing at any width: one column at 375, two from 640, and four from 1280 where a 4-up is
 * asked for. A 4-up only goes on a section that has the whole 1152px spine; inside the service
 * page's eight-column reading well, four cards would be 160px wide.
 *
 * The whole card is one `<Link>`, which is why it carries no second interactive element: a
 * stretched anchor over a heading gives the link a forty-word accessible name, and the obvious
 * repair breaks WCAG 2.5.3. The caret is the same "go there" mark the rows used, kept distinct from
 * the FAQ's CaretDown, which means "open this".
 *
 * Each card rises on its own entry. `reveal` is on the `ul`, so every `li` is watched individually
 * and fires when it crosses the viewport edge rather than when its section does, which is what the
 * reference does on its own card grids. There is no stagger: cards on one row cross together and
 * arrive together.
 *
 * This replaces a refusal, so the reason it was refused has to survive. What parked cards at part
 * opacity and failed axe on contrast was the scroll timeline, not the per-card animation: a scrubbed
 * animation stops wherever the reader stops. This is a played WAAPI animation with no park state,
 * re-measured clean on /about/, /guides/ and /compare/wordpress-vs-wix/. Both of the old bans still
 * stand on their own terms: no view timeline (docs/layout-ledger.md, Task 12) and no delay ladder.
 *
 * `Section` no longer carries `reveal`, and that is what makes this safe: one animated element per
 * ancestor chain, never a grid inside an animated wrapper.
 */
export function LinkCards({ items, cols = 2 }: { items: LinkCardItem[]; cols?: 2 | 4 }) {
  const n = items.length;
  // `cols` is the ceiling, not the count. These sets are small and they are not hypothetical: a
  // service lists 1 to 4 errors, a guide 1 to 3 siblings, a hub 3 to 11 services, so a grid that
  // always opened four wide put a single card in a quarter of the spine with three empty cells
  // beside it, which reads as a layout that failed rather than as one door.
  //
  // Three is never a column count (contract rule 6 bans three equal cards in a row), so a set of
  // three runs two across with the last one taking the full width. That is the odd-trailing pattern
  // the service page's "What we do" tiles and the hub's problem grid already use, for the same
  // reason: a card alone beside a hole reads as something the layout forgot.
  const across = n < 4 ? (n === 3 ? 2 : n) : cols;
  const wideLast = across === 2 && n % 2 === 1;
  return (
    <ul className={cn("reveal grid items-stretch gap-4", across >= 2 && "sm:grid-cols-2", across === 4 && "xl:grid-cols-4")}>
      {items.map((i, index) => {
        const Icon = i.icon;
        return (
          // `card-plate` draws the plate this card slides off, as a `::before` on this wrapper
          // rather than as an element in the card. See globals.css for why it cannot live on the
          // anchor, and Task 62 for why it is a utility rather than markup.
          <li key={i.href} className={cn("card-plate", wideLast && index === n - 1 && "sm:col-span-2")}>
            <Link href={i.href} className={cn(cardLink, "flex h-full flex-col", i.banner && "isolate overflow-hidden")}>
              {/* The render is the card's background, not a strip across its top.

                  `-z-20` for the picture and `-z-10` for the scrim, both inside the card's own
                  `isolate`, so they paint above the card's `bg-surface` and below every child in
                  flow. `overflow-hidden` is what makes the 14px radius clip the picture.

                  Two costs, both real and both measured. A 2.41:1 render in a 540x416 card is
                  cropped to the middle 54% and upscaled about 2.8x, against 1.5x when it was a
                  banner at the card's own ratio, so it is softer and shows less of itself. And it
                  now has type on it: `--card-scrim` is 0.78 rather than the shared 0.66 because the
                  title's ember hover needs 3:1 as large text and measures 2.25:1 at 0.66. At 0.78
                  the picture is about a fifth of its own brightness, so it reads as a lit texture
                  behind the words rather than as a photograph. That is the trade this layout makes.

                  A card with no render keeps the plain surface and its icon; there is no empty box
                  to fill, so `anyBanner` is not needed here the way it was for the banner. */}
              {i.banner && (
                <>
                  <Photo
                    id={i.banner}
                    decorative
                    sizes="(min-width: 1280px) 276px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                    className="absolute inset-0 -z-20 transition-[scale] duration-500 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-105 motion-reduce:scale-100!"
                  />
                  <span aria-hidden className="absolute inset-0 -z-10 bg-card-scrim" />
                </>
              )}
              <span className="flex h-full flex-col">
              {/* The caret is absolutely placed at the card's top right and costs no layout at all.
                  It was a flex row of its own, which worked on a card with an icon, because the icon
                  was already that row, and left 36px of dead space above the title on a card without
                  one: a 20px row holding nothing but the caret, plus the title's 16px margin. That
                  is the gap this fixes.

                  Out of flow it sits in the same corner on both kinds and the title keeps its
                  original rhythm: hard against the top of a plain card, 16px under the icon on a card
                  that has one. `cardLink` supplies the `relative` this positions against. The title
                  carries `pr-7` so its first line clears the glyph rather than running under it. */}
              <CaretRightIcon
                weight="duotone"
                aria-hidden
                // `translate`, not `transform`, in the transition list. Tailwind v4 emits
                // `translate-x-0.5` as the `translate` property, so a transition naming `transform`
                // does not cover it and the caret jumps its 2px instead of travelling them.
                // `motion-reduce:translate-none!` for the same reason, and the `!` because the hover
                // utility is the more specific of the two.
                className="absolute top-5 right-5 size-5 shrink-0 text-muted transition-[color,translate] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none motion-reduce:translate-none!"
              />
              {Icon && <Icon weight="duotone" aria-hidden className="size-7 shrink-0 text-accent-text" />}
              <span
                className={cn(
                  "block max-w-[40ch] pr-7 font-display text-lg leading-snug font-bold transition-colors duration-200 [font-variation-settings:'opsz'_18] group-hover:text-accent-text motion-reduce:transition-none",
                  Icon && "mt-4",
                  i.banner && "text-on-photo",
                )}
              >
                {i.title}
              </span>
              {/* Two lines: it is here to be recognised, not read. No `block` beside `line-clamp-2`,
                  because both set `display` and the plain utility wins over the clamp's -webkit-box,
                  which silently turns the clamp off. */}
              {i.code && <span className="mt-3 line-clamp-2 font-mono text-[15px] leading-snug text-muted">{i.code}</span>}
              {/* Three lines, and no `block` beside the clamp for the reason above: written
                  `line-clamp-3 block` the plain utility won and the clamp did nothing, which is how
                  the hub's eleven cards shipped with seven-line summaries. The full sentence is on
                  the page this card opens; what the card owes the reader is enough to choose. */}
              {/* --on-photo on a card with a picture behind it: --muted measures 4.28:1 over this
                  scrim and body copy needs 4.5. Same swap the hero lead makes for the same reason. */}
              {i.summary && <span className={cn("mt-2 line-clamp-3 text-sm", i.banner ? "text-on-photo" : "text-muted")}>{i.summary}</span>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Title for any internal path a content file links to (SITEMAP node, guide or compare). */
export const titleForPath = (p: string) => {
  const node = nodeByPath.get(p);
  if (node) return node.title;
  const [, kind, slug] = p.split("/");
  if (kind === "guides") return getGuide(slug)?.title ?? p;
  if (kind === "compare") {
    const c = getCompare(slug);
    return c ? `${c.a} vs ${c.b}` : p;
  }
  return p;
};

export function LinkList({ paths }: { paths: string[] }) {
  return (
    // `reveal-self` on the row, not `reveal` on it: these are related links, orientation furniture
    // rather than content, and nine chips arriving one at a time is the row performing.
    <ul className="reveal-self flex flex-wrap gap-2">
      {paths.map((p) => (
        <li key={p}>
          <Link
            href={p}
            className="inline-flex min-h-11 items-center rounded-[14px] border border-line-strong px-4 text-[15px] font-medium transition-colors duration-200 hover:border-accent hover:text-accent-text"
          >
            {titleForPath(p)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * A real capture from scripts/capture-errors.mjs, in a device frame, rendered only once the file exists.
 *
 * `sizes` is required because this component sits in two containers of very different widths and is
 * preloaded in both: the service hero's col-span-5 of a 12-column grid on the 1152px inner
 * container, and in the guide a box capped at 68ch rather than by the container. The single hardcoded
 * `(min-width: 1024px) 60vw` it used to carry declared 864px at 1440, so the service page preloaded
 * the 1080w candidate into a 432px box, a 2.5x over-fetch on its own LCP element.
 */
export function RealScreen({
  slot,
  alt,
  sizes,
  preload = false,
  className,
}: {
  slot: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  /**
   * Margin and measure from the call site. It exists so a caller never has to wrap this in a box of
   * its own: this component returns `null` when the capture does not exist, and a wrapper around it
   * does not, so the wrapper renders as an empty element with live margins on every page that has
   * no capture. That is exactly what happened on 33 of the 37 guides.
   */
  className?: string;
}) {
  const src = `/screens/${slot}.png`;
  const file = join(process.cwd(), "public", src);
  if (!existsSync(file)) return null;
  const { width, height } = pngSize(file); // the real shape, so the reserved box is the final box
  return (
    <figure className={cn("overflow-hidden rounded-[14px] bg-surface-2 p-2", className)}>
      <Image src={src} alt={alt} width={width} height={height} preload={preload} sizes={sizes} className="rounded-[14px]" />
    </figure>
  );
}

/** Shown instead of the fixmywp.com legal text while brand.legacy.enabled is false. */
export function LegalPending({ title }: { title: string }) {
  return (
    <div className={cn(page, pageY)}>
      <h1 className={h1}>{title}</h1>
      <p className={cn(prose, "mt-4")}>This page is being prepared. Until it is published, write to us with any question about it.</p>
      {/* The sentence above invites the reader to write to us and, until now, gave them nothing to
          do it with. These two pages (terms and privacy) were the only public routes on the site
          with no call to action at all, which is also the only place that sentence could be read as
          a dead end. The band every other reading page closes on. */}
      <ClosingBand
        title="Have a question about this?"
        actions={
          <>
            <BookLink location="legal:closing" className="btn-primary" />
            <ChatButton location="legal:closing" className="btn-secondary" />
          </>
        }
      />
    </div>
  );
}

/**
 * The three `remoteDelivery` stations as a numbered track, and now the only place it is written.
 *
 * Built for /about/ in Tasks 30 and 31 from a reference the owner supplied, and lifted here
 * verbatim in Task 38 because `CityTemplate` was rendering the same three entries as
 * `sm:grid-cols-3`, which is contract rule 6's three equal cards in a row: the same violation
 * Task 34 found in `CompareTemplate`. Two call sites, one component, so the shape cannot drift and
 * rule 6's numeral exception is spent once rather than per template.
 *
 * `sizes` was a prop while the city page was capped at `max-w-4xl` and its station was 272px
 * against 368 on /about/. Every page runs the 1200px spine now (Task 40), so both call sites are a
 * constant (1152 - 48) / 3 = 368px from `lg` up and the prop had nothing left to vary. One hint,
 * written once, measured at 368 on both pages.
 *
 * Every number on it was measured against the real crops, not assumed. `--card-scrim` at 0.78
 * (the token the hub cards use) over the worst case of the three (Meetings, whose ember arc is the
 * brightest pixel in the set) puts `--on-photo` at 9.9:1 and `--muted` at 4.50:1. 4.50 is the body
 * floor exactly, with nothing in hand, so every string on these cards is `--on-photo` and none is
 * `--muted`. The first station's numeral drops its ember for the same reason: ember measures 3.63:1
 * here, under the 4.5 a 14px bold word needs, so an ember border marks the first station instead.
 *
 * `ol`, not `dl`. The numerals are the design, and an ordered list says "1 of 3" to a screen reader
 * on its own, so every numeral on screen is `aria-hidden` decoration over real semantics rather
 * than a label typed into the page. Rule 6's other two bans were not spent: no ember bloom behind
 * the first card (a firm ember border over the page background carries the same "you start here"
 * without a glow), and no arrow in the corner, because these three are not links and an arrow that
 * goes nowhere is a promise the card cannot keep.
 */
export function RemoteTrack() {
  return (
    <ol className="reveal relative grid gap-5 lg:grid-cols-3 lg:gap-6">
      {remoteDelivery.map((r, i) => {
        const Mark = deliveryIcon[r.label as keyof typeof deliveryIcon];
        const first = i === 0;
        const n = String(i + 1).padStart(2, "0");
        return (
          <li key={r.label} className="relative lg:pt-14">
            {/* The track, drawn per column so it bridges the grid gap: dashed the whole way, with
                the run into the first station solid, which is the only thing marking where the
                sequence starts. Hidden below lg, where the cards simply stack. */}
            <span aria-hidden className="absolute inset-x-0 top-5 hidden border-t border-dashed border-line-strong lg:block" />
            {first && <span aria-hidden className="absolute top-5 right-1/2 left-0 hidden h-px bg-accent lg:block" />}
            <span
              aria-hidden
              className={cn(
                "absolute top-0 left-1/2 hidden size-10 -translate-x-1/2 place-items-center rounded-full border bg-bg font-display text-sm font-bold tabular-nums lg:grid",
                first ? "border-accent text-accent-text" : "border-line-strong text-muted",
              )}
            >
              {n}
            </span>

            {/* `-z-20` for the picture and `-z-10` for the scrim, inside the card's own `isolate`,
                so both sit above `bg-surface` and below every child in flow, and `overflow-hidden`
                is what makes the 14px radius clip the picture. */}
            <div className={cn(card, "relative isolate h-full overflow-hidden", first && "border-accent")}>
              <Photo
                id={deliveryPhoto[r.label]}
                decorative
                sizes="(min-width: 1024px) 368px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                className="absolute inset-0 -z-20"
              />
              <span aria-hidden className="absolute inset-0 -z-10 bg-card-scrim" />
              <div className="flex items-start justify-between gap-4">
                {/* The first card carries an ember edge over the page background rather than the
                    shared plate: on a card already bordered in ember, a tile in `--accent-tint`
                    is invisible, so the icon floated with no plate while the other two had one. */}
                <span
                  className={cn(
                    "grid size-14 shrink-0 place-items-center rounded-[14px] border bg-bg text-accent-text",
                    first ? "border-accent" : "border-line-strong",
                  )}
                >
                  <Mark weight="duotone" aria-hidden className="size-6" />
                </span>
                {/* The station number for the stacked layout, where there is no track to hang it
                    on. Same numeral, same `aria-hidden`, different place. */}
                <span aria-hidden className="font-display text-sm font-bold tabular-nums text-on-photo lg:hidden">
                  {n}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold [font-variation-settings:'opsz'_18]">{r.label}</h3>
              <p className="mt-2 max-w-[42ch] text-on-photo">{r.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
