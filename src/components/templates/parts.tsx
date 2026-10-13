import { existsSync } from "node:fs";
import { join } from "node:path";
import { CheckIcon, WarningIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { breadcrumbLd, JsonLd, type Crumb } from "@/components/JsonLd";
import type { CtaIntent } from "@/config/cta";
import { nodeByPath } from "@/config/routes";
import { getCompare, getGuide } from "@/content";
import { hubPhotos, photoFocus, servicePhotos } from "@/content/service-photos";

// Shared template furniture in the v2-swiss-precision language. These are deliberately NOT the home
// page's layout families (docs/layout-ledger.md): templates get stacked bands, checklists and
// labelled lists, never the hero split, the verb row, the pricing rows or the two-column FAQ.

export const pageMetadata = (seo: { title: string; description: string }, path: string): Metadata => ({
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: path },
  openGraph: { title: seo.title, description: seo.description, url: path, type: "website" },
});

/** One full-bleed band: top hairline, 1200px container, consistent vertical rhythm. */
export function Band({
  children,
  labelledBy,
  className = "",
  bleed = true,
}: {
  children: React.ReactNode;
  labelledBy?: string;
  className?: string;
  /** false when the band already sits inside a column, so it adds no second container. */
  bleed?: boolean;
}) {
  if (!bleed) {
    return (
      <section aria-labelledby={labelledBy} className={`border-t border-line py-10 md:py-12 ${className}`}>
        {children}
      </section>
    );
  }
  return (
    <section aria-labelledby={labelledBy} className={`border-t border-line ${className}`}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:py-16">{children}</div>
    </section>
  );
}

export function BandTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="max-w-[24ch] text-[clamp(1.5rem,2.4vw,2rem)]">
      {children}
    </h2>
  );
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd data={breadcrumbLd(items)} />
      <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((c, i) => (
            <li key={c.path} aria-current={i === items.length - 1 ? "page" : undefined} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
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

/** Checklist with real marks. Used for symptoms, so a visitor can match what they see. */
export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 grid gap-px sm:grid-cols-2 sm:gap-x-10">
      {items.map((x) => (
        <li key={x} className="flex gap-3 border-t border-line py-3">
          <CheckIcon aria-hidden size={18} weight="bold" className="mt-1 shrink-0 text-accent-text" />
          <span className="text-[0.9375rem]">{x}</span>
        </li>
      ))}
    </ul>
  );
}

/** Plain bordered list. One column, so it never reads as the home directory's grouped columns. */
export function PlainList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 max-w-[70ch]">
      {items.map((x) => (
        <li key={x} className="border-t border-line py-3 text-[0.9375rem] text-muted">
          {x}
        </li>
      ))}
    </ul>
  );
}

/** Verb-labelled steps, stacked. The home page spends the horizontal verb row; this is the vertical one. */
export function LabelledSteps({ steps }: { steps: { verb: string; detail: string }[] }) {
  return (
    <ol className="mt-6 max-w-[80ch]">
      {steps.map((s) => (
        <li key={s.verb} className="grid gap-1 border-t border-line py-5 md:grid-cols-[12rem_1fr] md:gap-6">
          <span className="font-bold">{s.verb}</span>
          <span className="text-muted">{s.detail}</span>
        </li>
      ))}
    </ol>
  );
}

export function Caution({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 flex max-w-[70ch] gap-3 border border-muted p-4 text-[0.9375rem]">
      <WarningIcon aria-hidden size={18} weight="bold" className="mt-0.5 shrink-0 text-accent-text" />
      <span>{children}</span>
    </p>
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
    <ul className="mt-6 grid gap-px sm:grid-cols-2 sm:gap-x-10">
      {paths.map((p) => (
        <li key={p} className="border-t border-line">
          <Link
            href={p}
            className="flex min-h-11 items-center py-3 text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
          >
            {titleForPath(p)}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The visual for a service or guide page, resolved from its slot and rendered only once the file
 * exists, so a missing asset leaves the page short rather than showing a stand-in (contract rule 6).
 *
 * `service-<id>`  a photograph from public/site_images/services/, via servicePhotos
 * anything else   a real capture from scripts/capture-errors.mjs in public/screens/
 *
 * The written `alt` describes a screen state, so it belongs to the capture. A photograph carries
 * nothing the heading does not and is decorative, so it ships with an empty alt, as v1 did.
 *
 * The `illustration-*` slots resolve to a capture that no run produces, so they render nothing:
 * they describe evidence from outside the install (a Google warning, a Search Console report)
 * that breaking a local WordPress cannot capture. Logged in docs/image-todo.md.
 */
export function RealScreen({
  slot,
  alt,
  priority = false,
  hero = false,
}: {
  slot: string;
  alt: string;
  priority?: boolean;
  hero?: boolean;
}) {
  const photo = slot.startsWith("service-") ? servicePhotos[slot.slice("service-".length)] : hubPhotos[slot];
  const src = photo ? `/site_images/services/${photo}.jpg` : `/screens/${slot}.png`;
  if (!existsSync(join(process.cwd(), "public", src))) return null;

  // The hero variant is the home hero's shape: a 4:5 box on md and up, cropped to 16:9 below it,
  // no border. The default is the in-body figure a capture is shown in.
  if (hero)
    return (
      <div className="-mx-6 aspect-video md:mx-0 md:aspect-4/5">
        <Image
          src={src}
          alt={photo ? "" : alt}
          width={1600}
          height={1000}
          priority={priority}
          sizes="(min-width: 1200px) 500px, (min-width: 768px) 42vw, 100vw"
          className={`h-full w-full object-cover${photo ? ` grayscale ${photoFocus[photo] ?? "object-center"}` : ""}`}
        />
      </div>
    );

  return (
    <figure className="mt-10">
      <Image
        src={src}
        alt={photo ? "" : alt}
        width={1600}
        height={1000}
        priority={priority}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className={`w-full border border-line${photo ? " grayscale" : ""}`}
      />
    </figure>
  );
}

/** Single-column disclosure group. The home page spends the two-column FAQ family. */
export function Faqs({
  faqs,
  title = "Questions",
  bleed = true,
}: {
  faqs: { q: string; a: string }[];
  title?: string;
  bleed?: boolean;
}) {
  return (
    <Band labelledBy="faq" bleed={bleed}>
      <BandTitle id="faq">{title}</BandTitle>
      <div className="mt-8 max-w-[80ch]">
        {faqs.map((f) => (
          <details key={f.q} className="group border-t border-line last:border-b last:border-b-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="shrink-0 font-mono text-muted group-open:hidden">
                +
              </span>
              <span aria-hidden className="hidden shrink-0 font-mono text-muted group-open:inline">
                &minus;
              </span>
            </summary>
            <p className="max-w-[70ch] pb-5 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Band>
  );
}

/** Closing band. Short and horizontal, never the home page's oversized typographic statement. */
export function CtaBand({
  intent,
  location,
  service,
  title,
}: {
  intent: CtaIntent;
  location: string;
  service?: string;
  title: string;
}) {
  return (
    <Band labelledBy="cta-band">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h2 id="cta-band" className="max-w-[24ch] text-[clamp(1.5rem,2.4vw,2rem)]">
          {title}
        </h2>
        <CtaPair intent={intent} location={location} service={service} />
      </div>
    </Band>
  );
}

/** Shown instead of the fixmywp.com legal text while brand.legacy.enabled is false. */
export function LegalPending({ title }: { title: string }) {
  return (
    <Band>
      <h1 className="text-[clamp(1.75rem,3vw,2.5rem)]">{title}</h1>
      <p className="mt-6 max-w-[60ch] text-muted">
        This page is being prepared. Until it is published, write to us with any question about it.
      </p>
    </Band>
  );
}
