import type { Metadata } from "next";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import { nodeByPath } from "@/config/routes";
import { getCompare, getGuide } from "@/content";
import { BrowserFrame } from "@/components/sections/v1/BrowserFrame";
import { FaqAccordion } from "@/components/sections/v1/FaqAccordion";
import { h2 } from "@/components/sections/v1/page-kit";

export const pageMetadata = (seo: { title: string; description: string }, path: string): Metadata => ({
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: path },
  openGraph: { title: seo.title, description: seo.description, url: path, type: "website" },
});

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbLd(items)} />
      <nav aria-label="Breadcrumb" className="pt-8 md:pt-10">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] text-muted">
          {items.map((c, i) => (
            <li key={c.path} aria-current={i === items.length - 1 ? "page" : undefined} className="flex items-center gap-2">
              {i === items.length - 1 ? (
                <span className="text-text">{c.name}</span>
              ) : (
                <>
                  <Link href={c.path} className="inline-flex min-h-11 items-center hover:text-text md:min-h-0">
                    {c.name}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/** Page FAQ: the V1 accordion. FAQPage JSON-LD is emitted by each template alongside its other structured data. */
export function Faqs({ faqs, title = "Questions" }: { faqs: { q: string; a: string }[]; title?: string }) {
  return (
    <section aria-labelledby="faq" className="mt-20">
      <h2 id="faq" className={h2}>
        {title}
      </h2>
      <div className="mt-8">
        <FaqAccordion items={faqs.map((f) => ({ q: f.q, a: f.a, pending: false }))} />
      </div>
    </section>
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

/** Plain link rows with an arrow. Used for related pages, guide lists and similar. */
export function LinkList({ items }: { items: { href: string; title: string; meta?: string }[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="group flex min-h-14 items-center justify-between gap-4 py-4 text-[16px] text-text">
            <span>
              {l.title}
              {l.meta && <span className="mt-1 block font-mono text-[12px] text-muted">{l.meta}</span>}
            </span>
            <ArrowRight size={18} aria-hidden className="shrink-0 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-text" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export const pathItems = (paths: string[]) => paths.map((p) => ({ href: p, title: titleForPath(p) }));

/** A real capture from scripts/capture-errors.mjs, rendered only once the file exists. */
export function RealScreen({ slot, alt, url = "https://example.com/" }: { slot: string; alt: string; url?: string }) {
  return <BrowserFrame slot={slot} alt={alt} url={url} realOnly />;
}

/** Shown instead of the fixmywp.com legal text while brand.legacy.enabled is false. */
export function LegalPending({ title }: { title: string }) {
  return (
    <article>
      <h1>{title}</h1>
      <p>This page is being prepared. Until it is published, write to us with any question about it.</p>
    </article>
  );
}
