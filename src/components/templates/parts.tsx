import { existsSync } from "node:fs";
import { join } from "node:path";
import { CaretRightIcon, CheckIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import { nodeByPath } from "@/config/routes";
import { getCompare, getGuide } from "@/content";
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
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {items.map((c, i) => (
            <li key={c.path} aria-current={i === items.length - 1 ? "page" : undefined} className="flex items-center gap-1">
              {i > 0 && <CaretRightIcon weight="duotone" className="size-3.5 shrink-0" aria-hidden />}
              {i === items.length - 1 ? (
                <span className="text-text">{c.name}</span>
              ) : (
                <Link href={c.path} className="hover:text-text">
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
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg font-bold marker:content-none [&::-webkit-details-marker]:hidden">
              {f.q}
              <CaretRightIcon weight="duotone" className="size-5 shrink-0 text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none" aria-hidden />
            </summary>
            <p className="mt-3 max-w-[70ch] text-muted">{f.a}</p>
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
