import { WarningIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { BookLink, ChatButton, CheckLink } from "@/components/Cta";
import { faqLd, guideLd, JsonLd, nodeCrumbs } from "@/components/JsonLd";
import { routes } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { coreFileWarning, railPoints } from "@/content/notices";
import type { Guide } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, CauseFlow, DiagnosticPanel, FactRail, Faqs, h1, LinkRows, page, RealScreen, Section, symptomsBesides, UrgencyBadge } from "./parts";

const textLink = "inline-flex min-h-11 items-center font-semibold text-accent-text underline underline-offset-4 hover:no-underline";

/**
 * /guides/<slug>/. Layout family: a troubleshooting document in a lead column with the conversion rail beside it,
 * opening on the error exactly as the software prints it. Informational intent, so the page answers first and
 * books second; the rail is what keeps the answer and the way out of it on screen together.
 */
export function GuideTemplate({ guide: g }: { guide: Guide }) {
  const parent = getService(g.parentService)!;
  const loc = `guide:${g.slug}`;
  const siblings = guidesFor(g.parentService).filter((x) => x.slug !== g.slug);
  // The panel shows the literal error text, or the first symptom on the 17 guides that print no message, so the
  // list drops whichever of the two it took (symptomsBesides carries the heuristic and its limits).
  const symptoms = symptomsBesides(g.symptoms, g.errorText ?? g.symptoms[0]);
  // The same `railPoints` set the service rail shows: see src/content/notices.ts for why the two are aligned.
  const points = railPoints;

  return (
    <article data-urgency={g.urgency} className={cn(page, "py-8 md:py-12")}>
      <JsonLd data={[guideLd(g), faqLd(g.faqs)]} />
      <Breadcrumbs items={[...nodeCrumbs(routes.guides), { name: g.title, path: routes.guide(g.slug) }]} />

      <header className="mt-6 max-w-[52rem]">
        <h1 className={h1}>{g.h1}</h1>
        <p className="mt-4">
          <UrgencyBadge level={g.urgency} />
        </p>
        <DiagnosticPanel errorText={g.errorText} fallback={g.symptoms[0]} className="mt-6" />
      </header>

      {/* Kept as an existence gate: a real capture swaps itself in on the next build once public/screens/ lands. */}
      <div className="mt-8">
        <RealScreen slot={g.image.slot} alt={g.image.alt} preload />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <Section id="symptoms" title="What you are seeing" className="mt-0 md:mt-0">
            <ul className="ml-5 list-disc space-y-2 text-muted marker:text-accent-text">
              {symptoms.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Section>

          <Section id="causes" title="What usually causes it">
            {/* Tiles, not a second bullet list: no layout family repeats on a page (contract rule 3). Causes run
                4 or 5, and an odd last tile spans the row rather than leaving half of one empty. */}
            <ul className="grid gap-3 sm:grid-cols-2">
              {g.likelyCauses.map((x, i) => (
                <li
                  key={x}
                  className={cn(
                    "rounded-[20px] border border-line bg-surface p-4 text-sm text-muted",
                    g.likelyCauses.length % 2 === 1 && i === g.likelyCauses.length - 1 && "sm:col-span-2",
                  )}
                >
                  {x}
                </li>
              ))}
            </ul>
            {/* The diagram is geometry and aria-hidden; the caption carries the same relation as a sentence. */}
            <figure className="mt-5 flex flex-col items-center gap-4 rounded-[20px] bg-surface-2 p-5 sm:flex-row sm:gap-6">
              <CauseFlow causes={g.likelyCauses.length} checks={g.safeChecks.length} />
              <figcaption className="max-w-[48ch] text-sm text-muted">
                Any one of those causes ends in the same failure, so the checks below are worth trying before you
                know which one it was.
              </figcaption>
            </figure>
          </Section>

          <Section id="safe-checks" title="Safe things to try first">
            <ol className="space-y-4">
              {g.safeChecks.map((x, i) => (
                <li key={x} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-tint font-display text-sm font-bold text-accent-text">{i + 1}</span>
                  <span className="pt-0.5">{x}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 flex gap-3 rounded-[20px] border border-line-strong bg-surface-2 p-4 text-sm">
              <WarningIcon weight="duotone" className="mt-0.5 size-5 shrink-0 text-accent-text" aria-hidden />
              <span>{coreFileWarning}</span>
            </p>
          </Section>

          <Section id="call-us" title="When to call us">
            <p className="max-w-[68ch] text-muted">{g.whenToCallUs}</p>
            <p className="mt-4">
              How we fix it:{" "}
              <Link href={parent.path} className={textLink}>
                {parent.title}
              </Link>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookLink location={`${loc}:call-us`} service={parent.id} guide={g.slug} className="btn-primary" />
              <ChatButton location={`${loc}:call-us`} service={parent.id} className="btn-secondary" />
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-muted">
              Nothing down right now? <CheckLink location={`${loc}:call-us`} service={parent.id} className={textLink} />
            </p>
          </Section>

          <Faqs faqs={g.faqs} />

          {siblings.length > 0 && (
            <Section id="related-guides" title={`More ${parent.title.toLowerCase()} errors`}>
              <LinkRows items={siblings.map((x) => ({ href: routes.guide(x.slug), title: x.title, summary: x.symptoms[0] }))} />
            </Section>
          )}
        </div>

        {/* One rail node at every width (FactRail): sticky beside this column from lg, and in flow here below lg
            with the guarantee and the gated claims only, because the fixed bottom bar is the CTA there. */}
        <aside className="lg:col-span-4">
          <FactRail title={g.title} points={points}>
            <BookLink location={`${loc}:rail`} service={parent.id} guide={g.slug} className="btn-primary w-full" />
            <ChatButton location={`${loc}:rail`} service={parent.id} className="btn-secondary w-full" />
          </FactRail>
        </aside>
      </div>
    </article>
  );
}
