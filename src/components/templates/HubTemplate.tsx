import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { CtaBand, h1, h2, lead, pageWrap } from "@/components/sections/v1/page-kit";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getHub, getService, guidesFor } from "@/content";
import { Breadcrumbs, LinkList } from "./parts";

const urgencyRank = { critical: 0, high: 1, standard: 2 } as const;

/**
 * Hub page (/<hub>/). Layout family: two-column ledger list (service title | summary rows), distinct from the
 * home finder's tab index. Then the six most urgent guides and the CTA band.
 */
export function HubTemplate({ node }: { node: FlatNode }) {
  const id = hubIdOf(node.path);
  const hub = getHub(id)!;
  const children = nodes.filter((n) => n.parentPath === node.path);
  const services = children.filter((n) => n.kind === "service").map((n) => getService(serviceIdOf(n.path))!);
  const extra = children.filter((n) => n.kind !== "service");
  const topGuides = services
    .flatMap((s) => guidesFor(s.id))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])
    .slice(0, 6);
  const intent = primaryCtaFor(node.intent);
  const loc = `hub:${id}`;

  return (
    <>
      <div className={pageWrap}>
        <Breadcrumbs items={nodeCrumbs(node.path)} />
        <header className="pt-8 md:pt-12">
          <h1 className={`max-w-[20ch] ${h1}`}>{node.title}</h1>
          <p className={`mt-5 ${lead}`}>{hub.intro}</p>
          <div className="mt-8">
            <CtaPair intent={intent} location={`${loc}:hero`} hero />
          </div>
        </header>

        <section aria-labelledby="services" className="mt-20">
          <h2 id="services" className={h2}>
            Services
          </h2>
          <ul className="mt-8 border-t border-line">
            {services.map((s) => (
              <li key={s.id} className="border-b border-line">
                <Link
                  href={s.path}
                  className="group grid gap-2 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] md:items-baseline md:gap-10"
                >
                  <span className="text-lg font-semibold tracking-tight text-text">{s.title}</span>
                  <span className="text-[15px] leading-relaxed text-muted">{s.summary}</span>
                  <ArrowRight size={18} aria-hidden className="hidden text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-text md:block" />
                </Link>
              </li>
            ))}
            {extra.map((n) => (
              <li key={n.path} className="border-b border-line">
                <Link href={n.path} className="group flex items-center justify-between gap-4 py-6 text-lg font-semibold tracking-tight text-text">
                  {n.title}
                  <ArrowRight size={18} aria-hidden className="text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {topGuides.length > 0 && (
          <section aria-labelledby="urgent" className="mt-20">
            <h2 id="urgent" className={h2}>
              Most urgent errors
            </h2>
            <div className="mt-8">
              <LinkList items={topGuides.map((g) => ({ href: routes.guide(g.slug), title: g.title, meta: `urgency: ${g.urgency}` }))} />
            </div>
          </section>
        )}
      </div>

      <CtaBand line={hub.seo.description}>
        <CtaPair intent={intent} location={`${loc}:band`} />
      </CtaBand>
    </>
  );
}
