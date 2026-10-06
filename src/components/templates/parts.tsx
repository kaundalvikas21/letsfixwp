import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import { nodeByPath } from "@/config/routes";
import { getCompare, getGuide } from "@/content";

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
      <nav aria-label="Breadcrumb">
        <ol>
          {items.map((c, i) => (
            <li key={c.path} aria-current={i === items.length - 1 ? "page" : undefined}>
              {i === items.length - 1 ? c.name : <Link href={c.path}>{c.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function Faqs({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq">
      <h2 id="faq">Questions</h2>
      {faqs.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
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

export function LinkList({ paths }: { paths: string[] }) {
  return (
    <ul>
      {paths.map((p) => (
        <li key={p}>
          <Link href={p}>{titleForPath(p)}</Link>
        </li>
      ))}
    </ul>
  );
}

/** A real capture from scripts/capture-errors.mjs, rendered only once the file exists. */
export function RealScreen({ slot, alt }: { slot: string; alt: string }) {
  const src = `/screens/${slot}.png`;
  if (!existsSync(join(process.cwd(), "public", src))) return null;
  return (
    <figure>
      <Image src={src} alt={alt} width={1600} height={1000} preload sizes="(min-width: 1024px) 60vw, 100vw" />
    </figure>
  );
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
