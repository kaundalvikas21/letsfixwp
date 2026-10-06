import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookLink, ChatButton } from "@/components/Cta";
import { JsonLd, problemLd } from "@/components/JsonLd";
import { SiteStatus } from "@/components/SiteStatus";
import { categoryLabels } from "@/content/categories";
import { getProblem, problemPath } from "@/content/problems";
import type { Problem } from "@/content/schema";
import { site } from "@/content/site";

export const problemMetadata = (p: Problem): Metadata => ({
  title: { absolute: p.seo.title },
  description: p.seo.description,
  alternates: { canonical: problemPath(p) },
  openGraph: { title: p.seo.title, description: p.seo.description, url: problemPath(p), type: "website" },
});

/** A real capture from scripts/capture-errors.mjs, if one exists for this slot. */
const screenFor = (slot: string) => {
  const src = `/screens/${slot}.png`;
  return existsSync(join(process.cwd(), "public", src)) ? src : null;
};

export function ProblemTemplate({ problem: p }: { problem: Problem }) {
  const screen = screenFor(p.image.slot);
  const related = p.relatedSlugs.map((s) => getProblem(s)!);
  const loc = `problem:${p.slug}`;

  return (
    <article data-urgency={p.urgency} data-category={p.category}>
      <JsonLd data={problemLd(p)} />

      <nav aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/fix">WordPress problems</Link>
          </li>
          <li aria-current="page">{p.title}</li>
        </ol>
      </nav>

      <header>
        <p>{categoryLabels[p.category]}</p>
        <h1>{p.h1}</h1>
        <p>
          <BookLink location={`${loc}:hero`} problem={p.slug} /> <ChatButton location={`${loc}:hero`} />
        </p>
        <SiteStatus />
        {(p.typicalTurnaround || p.priceFrom) && (
          <dl>
            {p.typicalTurnaround && (
              <>
                <dt>Typical turnaround</dt>
                <dd>{p.typicalTurnaround}</dd>
              </>
            )}
            {p.priceFrom && (
              <>
                <dt>From</dt>
                <dd>{p.priceFrom}</dd>
              </>
            )}
          </dl>
        )}
      </header>

      {screen && (
        <figure>
          <Image src={screen} alt={p.image.alt} width={1600} height={1000} priority />
        </figure>
      )}

      <section aria-labelledby="symptoms">
        <h2 id="symptoms">What you are seeing</h2>
        <ul>
          {p.symptoms.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="causes">
        <h2 id="causes">What usually causes it</h2>
        <ul>
          {p.likelyCauses.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="our-fix">
        <h2 id="our-fix">How we fix it</h2>
        <ol>
          {p.ourFix.map((f) => (
            <li key={f.verb}>
              <strong>{f.verb}.</strong> {f.detail}
            </li>
          ))}
        </ol>
        <p>
          Every service carries a {site.guaranteeDays}-day guarantee.
          {p.category === "security" && ` Hacked sites are ${site.hackedPromise}.`}
        </p>
        <p>
          <BookLink location={`${loc}:fix`} problem={p.slug} />
        </p>
      </section>

      <section aria-labelledby="safe-checks">
        <h2 id="safe-checks">Two safe things to try first</h2>
        <ol>
          {p.safeChecks.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p>
          Still broken? <ChatButton location={`${loc}:safe-checks`} />
        </p>
      </section>

      <section aria-labelledby="faq">
        <h2 id="faq">Questions</h2>
        {p.faqs.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <section aria-labelledby="related">
        <h2 id="related">Related problems</h2>
        <ul>
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={problemPath(r)}>{r.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <p>
        <BookLink location={`${loc}:footer`} problem={p.slug} /> <ChatButton location={`${loc}:footer`} />
      </p>
    </article>
  );
}
