import { CtaPair } from "@/components/Cta";
import { compareLd, JsonLd } from "@/components/JsonLd";
import { CtaBand, h1, h2, pageWrap } from "@/components/sections/v1/page-kit";
import { primaryCtaFor } from "@/config/cta";
import { routes } from "@/config/routes";
import { getService } from "@/content";
import type { Compare } from "@/content/schema";
import { Breadcrumbs } from "./parts";

/**
 * /compare/<slug>/. Layout family: verdict ledger then a data table. Factual and neutral.
 * The primary CTA follows the intent of the closest service (content: closestService).
 */
export function CompareTemplate({ compare: c }: { compare: Compare }) {
  const title = `${c.a} vs ${c.b}`;
  const service = getService(c.closestService)!;
  const intent = primaryCtaFor(service.intent);

  return (
    <>
      <JsonLd data={compareLd(c)} />
      <div className={pageWrap}>
        <Breadcrumbs
          items={[
            { name: "Home", path: routes.home },
            { name: "Comparisons", path: routes.compares },
            { name: title, path: routes.compare(c.slug) },
          ]}
        />
        <header className="pt-8 md:pt-12">
          <h1 className={h1}>{title}</h1>
        </header>

        <section aria-labelledby="verdict" className="mt-14">
          <h2 id="verdict" className={h2}>
            Which fits you
          </h2>
          <dl className="mt-8 border-t border-line">
            {c.verdictByScenario.map((v) => (
              <div key={v.scenario} className="grid gap-2 border-b border-line py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10">
                <dt className="text-lg font-semibold tracking-tight text-text">{v.scenario}</dt>
                <dd className="text-[16px] leading-relaxed text-muted">{v.verdict}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="table" className="mt-20">
          <h2 id="table" className={h2}>
            Side by side
          </h2>
          <div className="mt-8 overflow-x-auto rounded-card border border-line">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[15px] leading-relaxed">
              <caption className="sr-only">
                {c.a} compared with {c.b}
              </caption>
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className="w-1/4 px-5 py-4 font-mono text-[12px] font-normal text-muted">
                    Criterion
                  </th>
                  <th scope="col" className="px-5 py-4 text-[15px] font-semibold text-text">
                    {c.a}
                  </th>
                  <th scope="col" className="px-5 py-4 text-[15px] font-semibold text-text">
                    {c.b}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr key={r.criterion} className="border-t border-line align-top">
                    <th scope="row" className="px-5 py-4 font-medium text-text">
                      {r.criterion}
                    </th>
                    <td className="px-5 py-4 text-muted">{r.a}</td>
                    <td className="px-5 py-4 text-muted">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <CtaBand line={c.seo.description}>
        <CtaPair intent={intent} location={`compare:${c.slug}`} service={service.id} />
      </CtaBand>
    </>
  );
}
