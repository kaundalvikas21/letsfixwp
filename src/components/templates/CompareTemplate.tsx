import { compareLd, JsonLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import type { Compare } from "@/content/schema";
import { Band, BandTitle, Breadcrumbs, CtaBand } from "./parts";

/**
 * /compare/<slug>/: factual and neutral. Verdict by scenario first, then the criteria table.
 * The table is deliberately NOT the home page's comparison matrix: no highlighted column, no accent
 * rule, no marks. Two neutral options side by side, because we are not one of them.
 */
export function CompareTemplate({ compare: c }: { compare: Compare }) {
  const title = `${c.a} vs ${c.b}`;
  return (
    <article>
      <JsonLd data={compareLd(c)} />

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs
          items={[
            { name: "Home", path: routes.home },
            { name: "Comparisons", path: routes.compares },
            { name: title, path: routes.compare(c.slug) },
          ]}
        />
        <h1 className="mt-8 max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">{title}</h1>
      </div>

      <Band labelledBy="verdict">
        <BandTitle id="verdict">Which one fits your situation</BandTitle>
        <dl className="mt-8">
          {c.verdictByScenario.map((v) => (
            <div key={v.scenario} className="grid gap-2 border-t border-line py-5 md:grid-cols-[22rem_1fr] md:gap-8">
              <dt className="font-bold">{v.scenario}</dt>
              <dd className="max-w-[60ch] text-muted">{v.verdict}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band labelledBy="criteria">
        <BandTitle id="criteria">Side by side</BandTitle>
        <div
          role="region"
          aria-label={`${title} compared criterion by criterion`}
          tabIndex={0}
          className="mt-8 overflow-x-auto [contain:paint]"
        >
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              {c.a} compared with {c.b}, criterion by criterion.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-muted py-3 pr-6 align-bottom font-medium">
                  Criterion
                </th>
                <th scope="col" className="border-b border-muted p-3 align-bottom font-medium">
                  {c.a}
                </th>
                <th scope="col" className="border-b border-muted p-3 align-bottom font-medium">
                  {c.b}
                </th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.criterion}>
                  <th scope="row" className="border-b border-line py-4 pr-6 align-top font-medium">
                    {r.criterion}
                  </th>
                  <td className="border-b border-line p-3 align-top text-[0.9375rem] text-muted">{r.a}</td>
                  <td className="border-b border-line p-3 align-top text-[0.9375rem] text-muted">{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Band>

      <CtaBand
        intent={primaryCtaFor(nodeByPath.get(routes.compares)?.intent)}
        location={`compare:${c.slug}`}
        title="Still deciding? Talk it through with an engineer."
      />
    </article>
  );
}
