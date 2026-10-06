import { CtaPair } from "@/components/Cta";
import { compareLd, JsonLd } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { nodeByPath, routes } from "@/config/routes";
import type { Compare } from "@/content/schema";
import { Breadcrumbs } from "./parts";

/** /compare/<slug>/: factual and neutral. */
export function CompareTemplate({ compare: c }: { compare: Compare }) {
  const title = `${c.a} vs ${c.b}`;
  return (
    <article>
      <JsonLd data={compareLd(c)} />
      <Breadcrumbs
        items={[
          { name: "Home", path: routes.home },
          { name: "Comparisons", path: routes.compares },
          { name: title, path: routes.compare(c.slug) },
        ]}
      />
      <h1>{title}</h1>

      <table>
        <caption>
          {c.a} compared with {c.b}
        </caption>
        <thead>
          <tr>
            <th scope="col">Criterion</th>
            <th scope="col">{c.a}</th>
            <th scope="col">{c.b}</th>
          </tr>
        </thead>
        <tbody>
          {c.rows.map((r) => (
            <tr key={r.criterion}>
              <th scope="row">{r.criterion}</th>
              <td>{r.a}</td>
              <td>{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section aria-labelledby="verdict">
        <h2 id="verdict">Which fits you</h2>
        <dl>
          {c.verdictByScenario.map((v) => (
            <div key={v.scenario}>
              <dt>{v.scenario}</dt>
              <dd>{v.verdict}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaPair intent={primaryCtaFor(nodeByPath.get(routes.compares)?.intent)} location={`compare:${c.slug}`} />
    </article>
  );
}
