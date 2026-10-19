import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { compareLd, JsonLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import type { Compare } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, Section, h1, h2, page, pageY } from "./parts";

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
    <article className={cn(page, pageY)}>
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
        <p className="rise-in mt-5 max-w-[68ch] text-lg text-muted" style={{ animationDelay: "70ms" }}>
          {c.seo.description}
        </p>
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
        {/* The table scrolls sideways under 768, so the scroll container needs a tab stop of its own
            or a keyboard visitor cannot reach the second half of it (axe scrollable-region-focusable,
            serious, which this page was failing at 375). Named and given a role for the same reason
            the fix rail on the home page is. */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`${c.a} compared with ${c.b}`}
          className="overflow-x-auto rounded-[14px] border border-line bg-surface shadow-card"
        >
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

      <section aria-labelledby="compare-closing" className="reveal mt-20 flex flex-col gap-5 border-t border-line pt-10 md:mt-28 md:flex-row md:items-center md:justify-between md:pt-12">
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
