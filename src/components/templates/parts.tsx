import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Icon } from "@phosphor-icons/react";
import { CaretDownIcon, CaretRightIcon, CheckIcon, WarningIcon, WarningOctagonIcon, WrenchIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { nodeByPath } from "@/config/routes";
import { getCompare, getGuide } from "@/content";
import { promises } from "@/content/notices";
import type { PhotoId } from "@/content/photos";
import { pngSize } from "@/lib/png-size";
import { cn } from "@/lib/utils";

// Template primitives for the active variation. Visual language from design-system/letsfixwp-v4/MASTER.md:
// dark locked, one ember accent, 14px on everything, Bricolage Grotesque display over Geist body, Geist Mono
// for error strings only. Density 3, so sections breathe further apart than they did on v3.

export const page = "mx-auto w-full max-w-6xl px-4 md:px-6";
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
export const pageY = "pt-24 pb-8 md:pt-28 md:pb-12";
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
  "group block rounded-[14px] border border-line bg-surface p-5 shadow-card",
  "transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
  "[@media(hover:hover)]:hover:border-line-strong [@media(hover:hover)]:hover:shadow-lift",
);

export const pageMetadata = (seo: { title: string; description: string }, path: string): Metadata => ({
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: path },
  openGraph: { title: seo.title, description: seo.description, url: path, type: "website" },
});

export function Section({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    // 64/96 is exactly half the home page's 128/192 between-section value: the same system at half
    // density, which is what a seven-section reading document wants. It was 56/80 against a 24px
    // heading-to-body gap, which at 375 let adjacent sections merge into one another.
    <section aria-labelledby={id} className={cn("reveal mt-16 md:mt-24", className)}>
      <h2 id={id} className={h2}>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * The band fills the page's whole spine, so the candidate it preloads is the spine's width: 1104px
 * once the 1152px container stops growing, the viewport less the gutters below that. It lived twice,
 * copied byte for byte into /about/ and /pricing/, and a third, narrower copy in GuideTemplate was
 * sized for a 336px column that no longer exists on these headers.
 */
export const bannerSizes = "(min-width: 1152px) 1104px, (min-width: 768px) calc(100vw - 48px), calc(100vw - 32px)";

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
  decorative = true,
  plate,
  actions,
  minH = "md:min-h-[24rem]",
  className,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  photo: PhotoId;
  /**
   * Decorative by default: on these pages the h1 and the lead already say what the page is, so the
   * frame beside them only sets mood. Pass `false` where the picture is content in its own right
   * and no sentence near it describes it, which is the case /about/ makes for itself.
   */
  decorative?: boolean;
  /** The literal string the owner is staring at, in the one typeface allowed to carry it. */
  plate?: string;
  actions?: React.ReactNode;
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
        "relative isolate mt-6 flex flex-col justify-end overflow-hidden rounded-[14px] p-6 shadow-card sm:p-10 md:p-14 lg:p-16",
        minH,
        className,
      )}
    >
      {/* No animation on it at all: it is the largest paint on the page. */}
      <Photo id={photo} decorative={decorative} preload sizes={bannerSizes} className="absolute inset-0 -z-10" />
      <span aria-hidden className="absolute inset-0 -z-10 bg-photo-scrim" />

      <h1 className={h1}>{title}</h1>
      {/* The machine's own words, and the anchor of the page: this string is what the visitor pasted
          into a search box. Mono on the inset surface, which is opaque, so its contrast is the
          token table's `--text` on `--surface-2` and not the scrim's. It wraps rather than scrolls,
          so there is no scrollable region to strand a keyboard visitor in at 375, and `anywhere` is
          the only break rule that holds a 90-character file path inside the band. Sized to the
          string, because "502 Bad Gateway" in a 1104px box read as an empty panel with a few
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
      className="closing-band reveal mt-20 overflow-hidden rounded-[14px] border border-line bg-surface p-8 shadow-card md:mt-28 md:p-12"
    >
      {/* A 7/5 grid, not a flex row with `justify-between`. The flex version let the heading set the
          gap, so a 24ch question and a 28ch one put the buttons in two different places and the
          band looked slightly different on every template. On a grid the actions sit on one column
          edge on all 99 routes, which is the whole point of there being one component. */}
      <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-12">
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

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbLd(items)} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {items.map((c, i) => (
            <li key={c.path} aria-current={i === items.length - 1 ? "page" : undefined} className="flex items-center gap-1">
              {i > 0 && <CaretRightIcon weight="duotone" className="size-3.5 shrink-0" aria-hidden />}
              {i === items.length - 1 ? (
                <span className="text-text">{c.name}</span>
              ) : (
                // py-1.5 takes the crumb from a 20px tap target to 32px, which clears WCAG 2.5.8's
                // 24px floor; it was the smallest target on the site and the one axe does not flag.
                // Deliberately not the contract's 44: a 44px row of 14px crumbs reads as a second
                // nav bar under the real one, and the same trade is already recorded for the footer.
                // Vertical padding only, so the first crumb's left edge stays on the page spine.
                // Nothing more than a colour fade: orientation furniture that performs is furniture
                // competing with the page.
                <Link href={c.path} className="inline-flex items-center py-1.5 transition-colors duration-150 hover:text-text">
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
      <div className="divide-y divide-line border-y border-line">
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
 * The promises tick list, for /contact/ and /legal/guarantee/.
 *
 * Both routes stated the same four commitments from their own copy of the array and their own copy
 * of this markup, which is how two promises drift into two different promises. The sentences are
 * the owner's approved wording and live in src/content/notices.ts; nothing here edits them, and
 * `first-letter:uppercase` is presentation only. A row renders only while its own claim is truthy,
 * because an unconfirmed claim is null.
 *
 * Not `TickList`: that one takes any strings and gives them no measure, and these need the claim
 * gate and the capital. `compact` is the /contact/ panel, which sits in a 5-column column beside
 * the form and sets its own measure, against the reading column on /legal/guarantee/, which does
 * not. One flag rather than four, because the two call sites are the two shapes.
 */
export function Promises({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {promises
        .filter(([confirmed]) => confirmed)
        .map(([, words]) => (
          <li key={words} className={cn("flex gap-3", compact && "text-sm")}>
            <CheckIcon weight="duotone" className={cn(compact ? "mt-0.5" : "mt-1", "size-5 shrink-0 text-accent-text")} aria-hidden />
            <span className={cn("block", !compact && "max-w-[60ch]", "first-letter:uppercase")}>{words}</span>
          </li>
        ))}
    </ul>
  );
}

export function TickList({ items, cols = 1 }: { items: readonly string[]; cols?: 1 | 2 }) {
  return (
    <ul className={cn("grid gap-3", cols === 2 && "sm:grid-cols-2 sm:gap-x-8")}>
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
export type LinkCardItem = { href: string; title: string; summary?: string; code?: string; icon?: Icon };

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
 * A directory of links as a grid of cards, each one a door to its own page.
 *
 * It replaces the ruled rows these sections used to render. A row works for a list that is read in
 * order; every one of these items is a separate page, and a card is what a reader scans when the
 * question is "which of these is mine". The ember hairline the rows used is gone with them: a card
 * that lifts does not also need a rule drawn under it.
 *
 * **Never three across** (contract rule 6). `cols` is 2 or 4 for that reason, so the ban needs no
 * special-casing at any width: one column at 375, two from 640, and four from 1280 where a 4-up is
 * asked for. A 4-up only goes on a section that has the whole 1104px spine; inside the service
 * page's eight-column reading well, four cards would be 160px wide.
 *
 * The whole card is one `<Link>`, which is why it carries no second interactive element: a
 * stretched anchor over a heading gives the link a forty-word accessible name, and the obvious
 * repair breaks WCAG 2.5.3. The caret is the same "go there" mark the rows used, kept distinct from
 * the FAQ's CaretDown, which means "open this".
 *
 * No entrance animation of its own. `Section` already carries `reveal`, so the grid settles as the
 * reader reaches it; a per-card stagger on a scroll timeline is what parked cards at part opacity
 * and failed axe on contrast before (docs/layout-ledger.md).
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
    <ul className={cn("grid items-stretch gap-4", across >= 2 && "sm:grid-cols-2", across === 4 && "xl:grid-cols-4")}>
      {items.map((i, index) => {
        const Icon = i.icon;
        return (
          <li key={i.href} className={cn(wideLast && index === n - 1 && "sm:col-span-2")}>
            <Link href={i.href} className={cn(cardLink, "flex h-full flex-col")}>
              {Icon && <Icon weight="duotone" aria-hidden className="size-7 shrink-0 text-accent-text" />}
              <span
                className={cn(
                  "block max-w-[40ch] font-display text-lg leading-snug font-bold transition-colors duration-200 [font-variation-settings:'opsz'_18] group-hover:text-accent-text motion-reduce:transition-none",
                  Icon && "mt-4",
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
              {i.summary && <span className="mt-2 line-clamp-3 text-sm text-muted">{i.summary}</span>}
              {/* Bottom right, which is where a card's "go there" mark belongs and where the row it
                  replaced kept it. `mt-auto` pushes it to the floor so every caret in a row sits on
                  one line however long the titles above them run, and `self-end` puts it on the far
                  edge rather than under the first word of the summary, where it read as a stray
                  glyph. The padding is on the wrapper, not on the icon: `size-5` sets the svg's own
                  box and under border-box any padding would eat the glyph. Same mark as the FAQ's
                  CaretDown is not: down means "open this", right means "go there". */}
              <span className="mt-auto self-end pt-5">
                <CaretRightIcon
                  weight="duotone"
                  aria-hidden
                  // `translate`, not `transform`, in the transition list. Tailwind v4 emits
                  // `translate-x-0.5` as the `translate` property, so a transition naming
                  // `transform` does not cover it and the caret jumps its 2px instead of travelling
                  // them. Measured in the browser: `getComputedStyle(svg).transform` is `none` and
                  // `.translate` is `2px`. `motion-reduce:translate-none!` for the same reason, and
                  // the `!` because the hover utility is the more specific of the two.
                  className="size-5 shrink-0 text-muted transition-[color,translate] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none motion-reduce:translate-none!"
                />
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
    <ul className="flex flex-wrap gap-2">
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
 * preloaded in both: 432px in the service hero (col-span-5 of a 12-column grid on a 1104px inner
 * container with 48px gutters) and 720px in the guide (max-w-3xl less px-6). The single hardcoded
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
    <article className={cn(page, pageY)}>
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
    </article>
  );
}
