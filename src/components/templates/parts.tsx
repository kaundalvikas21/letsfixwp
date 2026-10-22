import { existsSync } from "node:fs";
import { join } from "node:path";
import { CaretRightIcon, CheckIcon, SealCheckIcon, WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import { brand } from "@/config/brand";
import { nodeByPath, routes } from "@/config/routes";
import { getCompare, getGuide } from "@/content";
import type { Urgency } from "@/content/schema";
import { cn } from "@/lib/utils";

// v3 template primitives. Visual language from design-system/letsfixwp-v3/MASTER.md: 20px cards, 12px inputs,
// pill buttons, two-layer tinted shadows, one accent, Cabinet Grotesk display over Inter Tight body.

export const page = "mx-auto w-full max-w-6xl px-4 md:px-6";
export const prose = "max-w-[68ch] text-muted";
export const h1 = "font-display text-[2rem] leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem]";
export const h2 = "font-display text-2xl leading-tight font-extrabold tracking-[-0.01em] md:text-3xl";
export const card = "rounded-[20px] border border-line bg-surface p-6 shadow-card";

export const pageMetadata = (seo: { title: string; description: string }, path: string): Metadata => ({
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: path },
  openGraph: { title: seo.title, description: seo.description, url: path, type: "website" },
});

export function Section({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn("mt-12 md:mt-16", className)}>
      <h2 id={id} className={h2}>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbLd(items)} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {items.map((c, i) => (
            <li key={c.path} aria-current={i === items.length - 1 ? "page" : undefined} className="flex items-center gap-1">
              {i > 0 && <CaretRightIcon weight="duotone" className="size-3.5 shrink-0" aria-hidden />}
              {i === items.length - 1 ? (
                <span className="text-text">{c.name}</span>
              ) : (
                // min-h/min-w 11 keeps the crumb a 44x44 target (contract rule 5); the text stays left aligned.
                <Link href={c.path} className="inline-flex min-h-11 min-w-11 items-center hover:text-text">
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

/** Plain disclosure list: no JS, and deliberately not the home page's searchable FAQ card. */
export function Faqs({ faqs, title = "Questions" }: { faqs: { q: string; a: string }[]; title?: string }) {
  return (
    <Section id="faq" title={title}>
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group">
            {/* Padding sits on the summary, not the details, so the row itself is the 44px target (contract rule 5). */}
            <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 font-display text-lg font-bold marker:content-none [&::-webkit-details-marker]:hidden">
              {f.q}
              <CaretRightIcon weight="duotone" className="size-5 shrink-0 text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none" aria-hidden />
            </summary>
            <p className="max-w-[70ch] pb-4 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
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

/** Link rows: title, optional summary, chevron. Used for service and guide directories. */
export function LinkRows({ items }: { items: { href: string; title: string; summary?: string }[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((i) => (
        <li key={i.href}>
          <Link href={i.href} className="group flex items-start gap-4 py-4 hover:text-accent-text">
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-bold">{i.title}</span>
              {i.summary && <span className="mt-1 block max-w-[70ch] text-sm text-muted">{i.summary}</span>}
            </span>
            <CaretRightIcon
              weight="duotone"
              className="mt-1 size-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

const urgencyLabel: Record<Urgency, string> = { critical: "Critical", high: "High", standard: "Standard" };

/**
 * Guide urgency as weight, not a new hue: the accent for critical and muted otherwise. Colour is never the only
 * signal (contract rule 9): the level is written out, and critical and high carry different icons. Presentational
 * and not interactive, so it can sit inside a link row.
 */
export function UrgencyBadge({ level, className }: { level: Urgency; className?: string }) {
  const Icon = level === "critical" ? WarningOctagonIcon : level === "high" ? WarningIcon : null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs",
        level === "critical" ? "border-accent bg-accent-tint font-bold text-accent-text" : "border-line-strong font-medium text-muted",
        className,
      )}
    >
      {Icon && <Icon weight="duotone" className="size-3.5 shrink-0" aria-hidden />}
      {urgencyLabel[level]}
      <span className="sr-only"> urgency</span>
    </span>
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
            className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-sm font-medium hover:border-accent hover:text-accent-text"
          >
            {titleForPath(p)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Conversion rail for a page whose body runs in a lead column. One DOM node at every width: below lg it sits in
 * normal document flow as a reassurance panel, and from lg it becomes the sticky rail. The title and the CTA pair
 * are hidden below lg by CSS, because the global fixed bottom bar is the persistent CTA there.
 * Order is deliberate: the page's own CTA pair first, then the promises behind it. `facts` is for real numbers
 * out of src/content, and a null or missing value renders nothing for it (contract rule 8), so no row of the
 * rail is a placeholder figure. The guarantee comes from brand.guarantee and disappears when it is unset.
 */
export function FactRail({
  title,
  facts = [],
  points = [],
  children,
}: {
  title: string;
  facts?: readonly { k: string; v: string }[];
  points?: readonly string[];
  children: React.ReactNode;
}) {
  const g = brand.guarantee;
  // With no facts, no guarantee and no claims there is nothing to reassure anyone with, so the panel has no
  // reason to exist in flow; at lg the title and CTA pair still earn the rail.
  const hasBody = facts.length > 0 || !!g || points.length > 0;
  return (
    <div
      className={cn(
        "rounded-[20px] border border-line bg-surface p-6 shadow-card lg:sticky lg:top-28",
        !hasBody && "hidden lg:block",
      )}
    >
      <p className="hidden font-display text-lg leading-snug font-bold lg:block">{title}</p>
      <div className="hidden gap-2 lg:mt-5 lg:grid">{children}</div>

      {hasBody && (
        <div className="space-y-5 divide-y divide-line text-sm [&>*+*]:pt-5 lg:mt-6 lg:border-t lg:border-line lg:pt-5">
          {facts.length > 0 && (
            <dl className="space-y-2">
              {facts.map((f) => (
                <div key={f.k} className="flex justify-between gap-4">
                  <dt className="text-muted">{f.k}</dt>
                  <dd className="font-semibold tabular-nums">{f.v}</dd>
                </div>
              ))}
            </dl>
          )}

          {g && (
            <div>
              <Link
                href={routes.legal.guarantee}
                className="inline-flex min-h-11 min-w-11 items-center gap-2 font-semibold text-accent-text hover:underline hover:underline-offset-4"
              >
                <SealCheckIcon weight="duotone" className="size-5 shrink-0" aria-hidden />
                {g.days}-day guarantee
              </Link>
              {g.placeholder && <p className="text-muted">Placeholder, not a real offer yet.</p>}
            </div>
          )}

          {points.length > 0 && (
            <ul className="space-y-3 text-muted">
              {points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Symptoms with any line that restates `alreadyShown` removed, so a page never prints the same string twice:
 * the index card drops a symptom that quotes the error text it already shows, and the guide page drops whatever
 * the diagnostic panel took (the error text, or the first symptom when the failure prints no message).
 *
 * ponytail: a 24-character, case-sensitive prefix test matched as a substring, not a parser. What it cannot do,
 * so the next person rewording a guide can see what would break it:
 *   - 24 characters is the whole key, so two errors that open with the same long phrase read as one string;
 *   - it is case-sensitive, so a symptom that recapitalises the message keeps its duplicate;
 *   - the shortest errorText on the site is 11 characters, and a key that short drops every symptom containing
 *     it, not only the one quoting it;
 *   - a symptom that quotes the error loses its surrounding context with it, because the whole line goes.
 * Measured against all 37 guides on 2026-10-22: 14 of the 20 with errorText quote it, no second symptom repeats
 * the key, and the shortest list this leaves is three lines. A guide that ever reads wrong wants its own symptom
 * reworded, not a smarter matcher here.
 */
export const symptomsBesides = (symptoms: readonly string[], alreadyShown: string | undefined): string[] =>
  alreadyShown ? symptoms.filter((x) => !x.includes(alreadyShown.slice(0, 24))) : [...symptoms];

/**
 * The literal message a failure prints, set as typography on an inset surface with a 1px accent rule down the
 * left edge. Not a screenshot and not dressed as one: contract rule 6 and MASTER.md:189 ban div-built browser
 * chrome, so this is a quotation, labelled as the software's words rather than ours.
 *
 * `errorText` is optional and 17 of the 37 guides print no message at all. Rather than render an empty box or
 * nothing, the panel then carries `fallback` (the guide's first symptom) in plain type under its own label, and
 * the caller drops that line from its symptom list so nothing appears twice.
 */
export function DiagnosticPanel({ errorText, fallback, className }: { errorText?: string; fallback: string; className?: string }) {
  return (
    <figure className={cn("rounded-[12px] border border-line border-l-accent bg-surface-2 px-5 py-4", className)}>
      <figcaption className="text-sm font-semibold">{errorText ? "What WordPress prints" : "What you see on the page"}</figcaption>
      {errorText ? (
        <code className="mt-2 block font-mono text-sm break-words whitespace-pre-wrap">{errorText}</code>
      ) : (
        <p className="mt-2 max-w-[68ch]">{fallback}</p>
      )}
    </figure>
  );
}

/**
 * Several causes converging on one failure, and the same short set of safe checks leading out of it. Geometry
 * only, no words inside it beyond the numerals that match the ordered list of checks, and `aria-hidden`: it is a
 * diagram of content that already exists as two lists, and the figcaption beside it states the same relation as
 * a sentence, so a screen reader gets the information as text (contract rule 9).
 * Connectors use --line-strong rather than --line: --line measures 1.24:1 and is decorative only.
 */
export function CauseFlow({ causes, checks }: { causes: number; checks: number }) {
  const pitch = 30;
  const h = Math.max(causes, checks) * pitch + 20;
  const mid = h / 2;
  const row = (n: number, i: number) => mid + (i - (n - 1) / 2) * pitch;
  const node = "fill-accent-tint stroke-accent";
  return (
    <svg viewBox={`0 0 240 ${h}`} width="240" height={h} className="h-auto w-full max-w-[15rem] shrink-0" aria-hidden focusable="false">
      <g strokeWidth="1.5" fill="none" className="stroke-line-strong">
        {Array.from({ length: causes }, (_, i) => (
          <path key={`in-${i}`} d={`M20 ${row(causes, i)} C 62 ${row(causes, i)}, 76 ${mid}, 108 ${mid}`} />
        ))}
        {Array.from({ length: checks }, (_, i) => (
          <path key={`out-${i}`} d={`M132 ${mid} C 164 ${mid}, 178 ${row(checks, i)}, 204 ${row(checks, i)}`} />
        ))}
      </g>
      {Array.from({ length: causes }, (_, i) => (
        <circle key={`c-${i}`} cx="12" cy={row(causes, i)} r="6" strokeWidth="1.5" className={node} />
      ))}
      <circle cx="120" cy={mid} r="11" strokeWidth="1.5" className={node} />
      {Array.from({ length: checks }, (_, i) => (
        <g key={`k-${i}`}>
          <circle cx="216" cy={row(checks, i)} r="12" strokeWidth="1.5" className={node} />
          <text x="216" y={row(checks, i)} textAnchor="middle" dominantBaseline="central" className="fill-text font-sans text-[11px] font-bold">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** A real capture from scripts/capture-errors.mjs, in a device frame, rendered only once the file exists. */
export function RealScreen({ slot, alt, preload = false }: { slot: string; alt: string; preload?: boolean }) {
  const src = `/screens/${slot}.png`;
  if (!existsSync(join(process.cwd(), "public", src))) return null;
  return (
    <figure className="overflow-hidden rounded-[20px] bg-surface-2 p-2 shadow-card">
      <Image src={src} alt={alt} width={1600} height={1000} preload={preload} sizes="(min-width: 1024px) 60vw, 100vw" className="rounded-[12px]" />
    </figure>
  );
}

/** Shown instead of the fixmywp.com legal text while brand.legacy.enabled is false. */
export function LegalPending({ title }: { title: string }) {
  return (
    <article className={cn(page, "py-16")}>
      <h1 className={h1}>{title}</h1>
      <p className={cn(prose, "mt-4")}>This page is being prepared. Until it is published, write to us with any question about it.</p>
    </article>
  );
}
