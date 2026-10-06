import Link from "next/link";
import { CtaPair } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { Breadcrumbs } from "./parts";

const urgencyRank = { critical: 0, high: 1, standard: 2 } as const;

/** /<hub>/: its services and its top guides. */
export function HubTemplate({ node }: { node: FlatNode }) {
  const children = nodes.filter((n) => n.parentPath === node.path);
  const serviceChildren = children.filter((n) => n.kind === "service");
  const otherChildren = children.filter((n) => n.kind !== "service");
  const topGuides = serviceChildren
    .flatMap((n) => guidesFor(serviceIdOf(n.path)))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])
    .slice(0, 6);
  const loc = `hub:${hubIdOf(node.path)}`;

  return (
    <article>
      <Breadcrumbs items={nodeCrumbs(node.path)} />
      <h1>{node.title}</h1>
      <CtaPair intent={primaryCtaFor(node.intent)} location={loc} hero />

      <section aria-labelledby="services">
        <h2 id="services">Services</h2>
        <ul>
          {serviceChildren.map((n) => (
            <li key={n.path}>
              <Link href={n.path}>{n.title}</Link>
              <p>{getService(serviceIdOf(n.path))?.summary}</p>
            </li>
          ))}
        </ul>
        {otherChildren.map((n) => (
          <p key={n.path}>
            <Link href={n.path}>{n.title}</Link>
          </p>
        ))}
      </section>

      {topGuides.length > 0 && (
        <section aria-labelledby="guides">
          <h2 id="guides">Common problems</h2>
          <ul>
            {topGuides.map((g) => (
              <li key={g.slug}>
                <Link href={routes.guide(g.slug)}>{g.title}</Link>
              </li>
            ))}
          </ul>
          <p>
            <Link href={routes.guides}>All guides</Link>
          </p>
        </section>
      )}
    </article>
  );
}
