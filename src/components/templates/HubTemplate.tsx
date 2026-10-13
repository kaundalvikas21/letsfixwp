import Link from "next/link";
import { nodeCrumbs } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { Band, BandTitle, Breadcrumbs, CtaBand } from "./parts";

const urgencyRank = { critical: 0, high: 1, standard: 2 } as const;

/** /<hub>/: its services and its six most urgent guides. */
export function HubTemplate({ node }: { node: FlatNode }) {
  const children = nodes.filter((n) => n.parentPath === node.path);
  const serviceChildren = children.filter((n) => n.kind === "service");
  const otherChildren = children.filter((n) => n.kind !== "service");
  const topGuides = serviceChildren
    .flatMap((n) => guidesFor(serviceIdOf(n.path)))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])
    .slice(0, 6);
  const loc = `hub:${hubIdOf(node.path)}`;
  const lede = serviceChildren.length
    ? `${serviceChildren.length} services under ${node.title.toLowerCase()}, each with its own page, its own scope and its own booking link.`
    : node.title;

  return (
    <article>
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={nodeCrumbs(node.path)} />
        <h1 className="mt-8 max-w-[20ch] text-[clamp(2rem,4.2vw,3.25rem)]">{node.title}</h1>
        <p className="mt-6 max-w-[56ch] text-lg text-muted">{lede}</p>
      </div>

      {/* Service rows, not the home page's grouped directory columns. */}
      <Band labelledBy="services">
        <BandTitle id="services">Services</BandTitle>
        <ul className="mt-8">
          {serviceChildren.map((n) => {
            const s = getService(serviceIdOf(n.path));
            return (
              <li key={n.path} className="border-t border-line">
                <Link href={n.path} className="group grid gap-2 py-6 md:grid-cols-[22rem_1fr] md:gap-8">
                  <span className="font-bold transition-colors duration-200 group-hover:text-accent-text">{n.title}</span>
                  <span className="max-w-[60ch] text-[0.9375rem] text-muted">{s?.summary}</span>
                </Link>
              </li>
            );
          })}
          {otherChildren.map((n) => (
            <li key={n.path} className="border-t border-line">
              <Link
                href={n.path}
                className="flex min-h-11 items-center py-6 font-bold transition-colors duration-200 hover:text-accent-text"
              >
                {n.title}
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      {topGuides.length > 0 && (
        <Band labelledBy="guides">
          <BandTitle id="guides">Most urgent problems here</BandTitle>
          <ul className="mt-6 grid gap-px sm:grid-cols-2 sm:gap-x-10">
            {topGuides.map((g) => (
              <li key={g.slug} className="border-t border-line">
                <Link
                  href={routes.guide(g.slug)}
                  className="flex min-h-11 items-center gap-2 py-3 text-[0.9375rem] transition-colors duration-200 hover:text-accent-text"
                >
                  <span>{g.title}</span>
                  {g.urgency === "critical" && (
                    <span className="ml-auto font-mono text-xs text-accent-text">Critical</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link
              href={routes.guides}
              className="inline-flex min-h-11 items-center border-b border-muted text-sm text-muted transition-colors duration-200 hover:border-text hover:text-text"
            >
              All guides
            </Link>
          </p>
        </Band>
      )}

      <CtaBand intent={primaryCtaFor(node.intent)} location={loc} title={`Need help with ${node.title.toLowerCase()}?`} />
    </article>
  );
}
