import { WarningIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { faqLd, guideLd, JsonLd } from "@/components/JsonLd";
import { routes } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { coreFileWarning } from "@/content/notices";
import type { Guide } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, Faqs, LinkRows, RealScreen, Section, h1, page, pageY } from "./parts";

/**
 * /guides/<slug>/. Layout family: single-column troubleshooting document, measured for reading, with the error
 * text set in mono exactly as WordPress prints it. Informational intent, so the page answers first and books second.
 */
export function GuideTemplate({ guide: g }: { guide: Guide }) {
  const parent = getService(g.parentService)!;
  const loc = `guide:${g.slug}`;
  const siblings = guidesFor(g.parentService).filter((x) => x.slug !== g.slug);

  return (
    <article data-urgency={g.urgency} className={cn(page, pageY, "max-w-3xl")}>
      <JsonLd data={[guideLd(g), faqLd(g.faqs)]} />
      <Breadcrumbs
        items={[
          { name: "Home", path: routes.home },
          { name: "Knowledge Base", path: routes.guides },
          { name: g.title, path: routes.guide(g.slug) },
        ]}
      />

      <header className="mt-6">
        <h1 className={h1}>{g.h1}</h1>
        {g.errorText && (
          <p className="mt-6 overflow-x-auto rounded-[14px] border border-line-strong bg-surface-2 px-4 py-3 font-mono text-sm">
            <code>{g.errorText}</code>
          </p>
        )}
      </header>

      <div className="mt-8">
        <RealScreen slot={g.image.slot} alt={g.image.alt} preload />
      </div>

      <Section id="symptoms" title="What you are seeing">
        <ul className="ml-5 list-disc space-y-2 text-muted marker:text-accent-text">
          {g.symptoms.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </Section>

      <Section id="causes" title="What usually causes it">
        {/* Tiles, not a second bullet list: no layout family repeats on a page (contract rule 3). */}
        <ul className="grid gap-3 sm:grid-cols-2">
          {g.likelyCauses.map((x) => (
            <li key={x} className="rounded-[14px] border border-line bg-surface p-4 text-sm text-muted">
              {x}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="safe-checks" title="Safe things to try first">
        <ol className="space-y-4">
          {g.safeChecks.map((x, i) => (
            <li key={x} className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-[14px] bg-accent-tint font-display text-sm font-bold text-accent-text">{i + 1}</span>
              <span className="pt-0.5">{x}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex gap-3 rounded-[14px] border border-line-strong bg-surface-2 p-4 text-sm">
          <WarningIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
          <span>{coreFileWarning}</span>
        </p>
      </Section>

      <Section id="call-us" title="When to call us">
        <p className="max-w-[68ch] text-muted">{g.whenToCallUs}</p>
        <p className="mt-4">
          How we fix it:{" "}
          <Link href={parent.path} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
            {parent.title}
          </Link>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <BookLink location={`${loc}:call-us`} service={parent.id} guide={g.slug} className="btn-primary" />
          <ChatButton location={`${loc}:call-us`} service={parent.id} className="btn-secondary" />
        </div>
        <p className="mt-4 text-sm text-muted">
          Nothing down right now? <CheckLink location={`${loc}:call-us`} service={parent.id} />
        </p>
      </Section>

      <Faqs faqs={g.faqs} />

      {siblings.length > 0 && (
        <Section id="related-guides" title={`More ${parent.title.toLowerCase()} errors`}>
          <LinkRows items={siblings.map((x) => ({ href: routes.guide(x.slug), title: x.title }))} />
        </Section>
      )}
    </article>
  );
}
