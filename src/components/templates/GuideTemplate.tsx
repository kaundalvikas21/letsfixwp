import { Warning } from "@phosphor-icons/react/ssr";
import { BookLink, CheckLink } from "@/components/Cta";
import { faqLd, guideLd, JsonLd } from "@/components/JsonLd";
import { body, h1, h2 } from "@/components/sections/v1/page-kit";
import { routes } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { pageCopy } from "@/content/pages";
import type { Guide } from "@/content/schema";
import { BrowserFrame } from "@/components/sections/v1/BrowserFrame";
import { Breadcrumbs, Faqs, LinkList } from "./parts";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-16">
      <h2 id={id} className={h2}>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((x) => (
      <li key={x} className={`${body} relative pl-5 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2.5 before:bg-muted`}>
        {x}
      </li>
    ))}
  </ul>
);

/**
 * Guide page (/guides/<slug>/), informational intent. Layout family: single-column article (760px).
 * H1 is the exact error phrase; errorText sits in a mono block exactly as WordPress prints it.
 */
export function GuideTemplate({ guide: g }: { guide: Guide }) {
  const parent = getService(g.parentService)!;
  const related = guidesFor(parent.id).filter((x) => x.slug !== g.slug);
  const loc = `guide:${g.slug}`;

  return (
    <article data-urgency={g.urgency} className="mx-auto max-w-[47.5rem] px-4 pb-24 md:px-6">
      <JsonLd data={[guideLd(g), faqLd(g.faqs)]} />
      <Breadcrumbs
        items={[
          { name: "Home", path: routes.home },
          { name: "Knowledge Base", path: routes.guides },
          { name: g.title, path: routes.guide(g.slug) },
        ]}
      />

      <header className="pt-8 md:pt-12">
        <h1 className={h1}>{g.title}</h1>
        {g.errorText && (
          <pre tabIndex={0} className="mt-8 overflow-x-auto rounded-card border border-line bg-surface px-5 py-4 font-mono text-[14px] leading-relaxed whitespace-pre-wrap text-text">
            <code>{g.errorText}</code>
          </pre>
        )}
        <BrowserFrame slot={g.image.slot} url="https://example.com/" alt={g.image.alt} />
      </header>

      <Section id="symptoms" title="What you are seeing">
        <Bullets items={g.symptoms} />
      </Section>

      <Section id="causes" title="Likely causes">
        <Bullets items={g.likelyCauses} />
      </Section>

      <Section id="safe-checks" title="Safe things to try first">
        <ol className="space-y-4">
          {g.safeChecks.map((x) => (
            <li key={x} className={body}>
              {x}
            </li>
          ))}
        </ol>
        <p className="mt-8 flex gap-3 rounded-card border border-accent/50 bg-surface px-5 py-4 text-[15px] leading-relaxed text-text">
          <Warning size={20} aria-hidden className="mt-0.5 shrink-0 text-accent-ink" />
          <span>{pageCopy.guide.coreWarning.replace("{title}", g.title)}</span>
        </p>
      </Section>

      <Section id="call-us" title="When to call us">
        <p className={body}>{g.whenToCallUs}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <BookLink location={`${loc}:call-us`} service={parent.id} guide={g.slug} />
          <CheckLink location={`${loc}:call-us`} service={parent.id} />
        </div>
      </Section>

      <Faqs faqs={g.faqs} />

      <Section id="related" title={related.length ? `More ${parent.title.toLowerCase()} guides` : "How we fix it"}>
        <LinkList
          items={[
            ...related.map((x) => ({ href: routes.guide(x.slug), title: x.title, meta: x.errorText })),
            { href: parent.path, title: parent.title },
          ]}
        />
      </Section>
    </article>
  );
}
