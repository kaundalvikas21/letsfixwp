import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { compareLd, JsonLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import type { Compare } from "@/content/schema";
import { cn } from "@/lib/utils";
import { Breadcrumbs, ClosingBand, PageMasthead, Section, page, pageY } from "./parts";

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

      {/* This page had no picture at all, because the catalogue holds no honest frame of two
          technologies being weighed against each other and inventing one was never an option. A
          comparison is a neutral document, so it takes the catalogue's neutral frame: `cables`, a
          patch panel in black and white, which is mono and therefore the one tone that cannot imply
          a verdict. Logged in docs/image-todo.md as a stand-in with the direction its real
          photograph has to satisfy. */}
      <PageMasthead
        photo="cables"
        title={title}
        lead={c.seo.description}
        actions={
          <>
            <Primary location={`${loc}:hero`} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} className="btn-secondary" />
          </>
        }
      />

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

      <ClosingBand
        title={`Still deciding between ${c.a} and ${c.b}?`}
        measure="max-w-[28ch]"
        actions={
          <>
            <Primary location={`${loc}:closing`} className="btn-primary" />
            <ChatButton location={`${loc}:closing`} className="btn-secondary" />
          </>
        }
      />
    </article>
  );
}
