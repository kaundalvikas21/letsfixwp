import { ClosingCta } from "@/components/sections/v3/ClosingCta";
import { Illustration } from "@/components/sections/v3/Photo";
import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { compareLd, JsonLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import type { Compare } from "@/content/schema";
import { cn } from "@/lib/utils";
import { bentoLayout } from "@/lib/bento";
import { Breadcrumbs, h1, h2, HeroSplit, page, Section, Versus } from "./parts";

// Literal classes so Tailwind's scanner emits them; a computed `md:col-span-${n}` would not.
const SPAN = { 3: "md:col-span-3", 2: "md:col-span-2", 4: "md:col-span-4", 6: "md:col-span-6" } as const;

/**
 * /compare/<slug>/. Layout family: a verdict-by-scenario bento (2-up when the verdicts are similar in length) over a real comparison table. Factual and neutral:
 * no winner is declared, because which one fits depends on the scenario.
 */
export function CompareTemplate({ compare: c }: { compare: Compare }) {
  const title = `${c.a} vs ${c.b}`;
  const intent = primaryCtaFor(nodeByPath.get(routes.compares)?.intent);
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;
  const loc = `compare:${c.slug}`;
  const th = "border-b border-line-strong px-4 py-3 text-left font-display text-sm font-bold";
  const spans = bentoLayout(c.verdictByScenario.map((v) => v.scenario.length + v.verdict.length));
  const td = "border-b border-line px-4 py-3 align-top text-sm";

  return (
    <article className={cn(page, "py-8 md:py-12")}>
      <JsonLd data={compareLd(c)} />
      <Breadcrumbs
        items={[
          { name: "Home", path: routes.home },
          { name: "Comparisons", path: routes.compares },
          { name: title, path: routes.compare(c.slug) },
        ]}
      />

      <HeroSplit art={<Illustration id="charts-and-plans" sizes="(min-width: 1024px) 40vw, 100vw" />}>
        <Versus a={c.a} b={c.b} decorative className="mb-5" />
        <h1 className={h1}>{title}</h1>
        <p className="mt-5 max-w-[68ch] text-lg text-muted">{c.summary ?? c.seo.description}</p>
      </HeroSplit>

      <Section id="verdict" revealBody={false} title="Which one fits">
        <ul className="grid gap-4 md:grid-cols-6 md:gap-5">
          {c.verdictByScenario.map((v, i) => (
            <li key={v.scenario} data-reveal style={{ "--i": i } as React.CSSProperties} className={cn("rounded-[20px] border border-line bg-surface p-5 shadow-card", SPAN[spans[i] as keyof typeof SPAN])}>
              <h3 className="font-display text-base font-bold">{v.scenario}</h3>
              <p className="mt-2 max-w-[68ch] text-sm text-muted">{v.verdict}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="table" title="Side by side">
        <div tabIndex={0} role="region" aria-label={`${c.a} compared with ${c.b}, scrollable`} className="overflow-x-auto rounded-[20px] border border-line bg-surface shadow-card">
          <table className="w-full min-w-[40rem] border-collapse">
            <caption className="sr-only">
              {c.a} compared with {c.b}
            </caption>
            <thead>
              <tr>
                <th scope="col" className={th}>
                  Criterion
                </th>
                <th scope="col" className={cn(th, "border-t-2 border-t-accent")}>
                  <span className="mr-2 inline-grid size-6 place-items-center rounded-full border-2 border-accent text-xs text-accent-text" aria-hidden>
                    A
                  </span>
                  {c.a}
                </th>
                <th scope="col" className={cn(th, "border-t-2 border-t-text")}>
                  <span className="mr-2 inline-grid size-6 place-items-center rounded-full border-2 border-text text-xs" aria-hidden>
                    B
                  </span>
                  {c.b}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.criterion}>
                  <th scope="row" className={cn(td, "font-semibold")}>
                    {r.criterion}
                  </th>
                  <td className={cn(td, "text-muted")}>{r.a}</td>
                  <td className={cn(td, "text-muted")}>{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <ClosingCta
        id="compare-closing"
        title="Still weighing it up?"
        sub="An engineer will look at your site and say which of the two actually fits what you are running."
        location={`${loc}:closing`}
      />
    </article>
  );
}
