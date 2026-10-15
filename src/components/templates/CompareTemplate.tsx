import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { compareLd, JsonLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import type { Compare } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, h1, h2, page, Section } from "./parts";

/**
 * /compare/<slug>/. Layout family: verdict-by-scenario cards over a real comparison table. Factual and neutral:
 * no winner is declared, because which one fits depends on the scenario.
 */
export function CompareTemplate({ compare: c }: { compare: Compare }) {
  const title = `${c.a} vs ${c.b}`;
  const intent = primaryCtaFor(nodeByPath.get(routes.compares)?.intent);
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;
  const loc = `compare:${c.slug}`;
  const th = "border-b border-line-strong px-4 py-3 text-left font-display text-sm font-bold";
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

      <header className="mt-6">
        <h1 className={h1}>{title}</h1>
        <p className="mt-5 max-w-[68ch] text-lg text-muted">{c.seo.description}</p>
      </header>

      <Section id="verdict" title="Which one fits">
        <ul className="grid gap-4 md:grid-cols-3">
          {c.verdictByScenario.map((v) => (
            <li key={v.scenario} className="rounded-[14px] border border-line bg-surface p-5 shadow-card">
              <p className="font-display text-base font-bold">{v.scenario}</p>
              <p className="mt-2 text-sm text-muted">{v.verdict}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="table" title="Side by side">
        <div className="overflow-x-auto rounded-[14px] border border-line bg-surface shadow-card">
          <table className="w-full min-w-[40rem] border-collapse">
            <caption className="sr-only">
              {c.a} compared with {c.b}
            </caption>
            <thead>
              <tr>
                <th scope="col" className={th}>
                  Criterion
                </th>
                <th scope="col" className={th}>
                  {c.a}
                </th>
                <th scope="col" className={th}>
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

      <section aria-labelledby="compare-closing" className="mt-16 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <h2 id="compare-closing" className={cn(h2, "max-w-[28ch]")}>
          Still deciding between {c.a} and {c.b}?
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Primary location={`${loc}:closing`} className="btn-primary" />
          <ChatButton location={`${loc}:closing`} className="btn-secondary" />
        </div>
      </section>
    </article>
  );
}
