import { existsSync } from "node:fs";
import { join } from "node:path";
import { CaretDownIcon, CaretRightIcon, CheckIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import { nodeByPath } from "@/config/routes";
import { getCompare, getGuide } from "@/content";
import { promises } from "@/content/notices";
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
                  CaretRight turning 90 was a second vocabulary for one move; LinkRows keeps
                  CaretRight, so "go there" and "open this" are now two marks on purpose. */}
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
    <ul className={cn(className, "grid gap-3")}>
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
export function LinkRows({ items, split = false }: { items: { href: string; title: string; summary?: string }[]; split?: boolean }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((i) => (
        <li key={i.href}>
          <Link
            href={i.href}
            className={cn(
              "group relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 py-4 transition-colors duration-200 hover:text-accent-text",
              // The title column is a measure, not a third of the container: at 768 a 23rem column
              // would leave the summary at 38ch, which is under what a sentence needs.
              split && "md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_auto] md:gap-x-8 md:py-5 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)_auto] lg:gap-x-12",
            )}
          >
            {/* The practice rows' ember rule, which belongs here more than it does there: that row is
                not a link and this one is. It replaces the row's own hairline rather than sitting
                beside it, so nothing moves. Mouse only, or a tap would leave it lit. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-x-100"
            />
            {/* Capped on the same measure as the summary beside it: uncapped, a short title on a
                1104px hub row sat with its chevron 1104px away and read as two separate things. */}
            <span className="col-start-1 row-start-1 block max-w-[70ch] font-display text-lg font-bold [font-variation-settings:'opsz'_18]">{i.title}</span>
            {i.summary && (
              <span className={cn("col-start-1 row-start-2 block max-w-[70ch] text-sm text-muted", split && "md:col-start-2 md:row-start-1 md:mt-1")}>
                {i.summary}
              </span>
            )}
            <CaretRightIcon
              weight="duotone"
              className={cn(
                "col-start-2 row-start-1 mt-1 size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none",
                split && "md:col-start-3",
              )}
              aria-hidden
            />
          </Link>
        </li>
      ))}
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
export function RealScreen({ slot, alt, sizes, preload = false }: { slot: string; alt: string; sizes: string; preload?: boolean }) {
  const src = `/screens/${slot}.png`;
  const file = join(process.cwd(), "public", src);
  if (!existsSync(file)) return null;
  const { width, height } = pngSize(file); // the real shape, so the reserved box is the final box
  return (
    <figure className="overflow-hidden rounded-[14px] bg-surface-2 p-2">
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
    </article>
  );
}
