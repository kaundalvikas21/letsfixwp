import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { faqLd, JsonLd, nodeCrumbs, serviceLd } from "@/components/JsonLd";
import { SiteStatus } from "@/components/SiteStatus";
import { primaryCtaFor } from "@/config/cta";
import { routes } from "@/config/routes";
import { getGuide } from "@/content";
import type { Service } from "@/content/schema";
import { Breadcrumbs, Faqs, LinkList, RealScreen } from "./parts";

export function ServiceTemplate({ service: s }: { service: Service }) {
  const intent = primaryCtaFor(s.intent);
  const loc = `service:${s.id}`;

  return (
    <article data-intent={s.intent}>
      <JsonLd data={[serviceLd(s), faqLd(s.faqs)]} />
      <Breadcrumbs items={nodeCrumbs(s.path)} />

      <header>
        <h1>{s.h1}</h1>
        <p>{s.summary}</p>
        <CtaPair intent={intent} location={`${loc}:hero`} service={s.id} hero />
        {s.intent === "fix" && <SiteStatus />}
        {(s.typicalTurnaround || s.priceFrom) && (
          <dl>
            {s.typicalTurnaround && (
              <>
                <dt>Typical turnaround</dt>
                <dd>{s.typicalTurnaround}</dd>
              </>
            )}
            {s.priceFrom && (
              <>
                <dt>From</dt>
                <dd>{s.priceFrom}</dd>
              </>
            )}
          </dl>
        )}
      </header>

      <RealScreen slot={s.image.slot} alt={s.image.alt} />

      <section aria-labelledby="who">
        <h2 id="who">Who it is for</h2>
        <p>{s.whoItsFor}</p>
      </section>

      {s.symptoms.length > 0 && (
        <section aria-labelledby="symptoms">
          <h2 id="symptoms">What you are seeing</h2>
          <ul>
            {s.symptoms.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="what-we-do">
        <h2 id="what-we-do">What we do</h2>
        <ol>
          {s.whatWeDo.map((w) => (
            <li key={w.verb}>
              <strong>{w.verb}.</strong> {w.detail}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="deliverables">
        <h2 id="deliverables">What you get</h2>
        <ul>
          {s.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <CtaPair intent={intent} location={`${loc}:deliverables`} service={s.id} />
      </section>

      {s.guideSlugs.length > 0 && (
        <section aria-labelledby="guides">
          <h2 id="guides">Specific errors we fix</h2>
          <ul>
            {s.guideSlugs.map((slug) => (
              <li key={slug}>
                <Link href={routes.guide(slug)}>{getGuide(slug)?.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Faqs faqs={s.faqs} />

      {s.relatedPaths.length > 0 && (
        <section aria-labelledby="related">
          <h2 id="related">Related</h2>
          <LinkList paths={s.relatedPaths} />
        </section>
      )}
    </article>
  );
}
