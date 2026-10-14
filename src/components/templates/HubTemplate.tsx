import Link from "next/link";
import { BookLink, ChatButton, PlansLink, QuoteLink } from "@/components/Cta";
import { nodeCrumbs } from "@/components/JsonLd";
import { Photo } from "@/components/sections/v3/Photo";
import { primaryCtaFor } from "@/config/cta";
import { hubIdOf, nodes, routes, serviceIdOf, type FlatNode } from "@/config/routes";
import { getService, guidesFor } from "@/content";
import { hubLead } from "@/content/hubs";
import { hubPhotos } from "@/content/photos";
import { cn } from "@/lib/utils";
import { Breadcrumbs, h1, h2, LinkRows, page, Section } from "./parts";

const urgencyRank = { critical: 0, high: 1, standard: 2 } as const;

/**
 * /<hub>/. Layout family: wide lead block over a service directory of full-width rows, which is neither the home
 * bento nor the home command palette.
 */
export function HubTemplate({ node }: { node: FlatNode }) {
  const id = hubIdOf(node.path);
  const children = nodes.filter((n) => n.parentPath === node.path);
  const serviceChildren = children.filter((n) => n.kind === "service");
  const otherChildren = children.filter((n) => n.kind !== "service");
  const topGuides = serviceChildren
    .flatMap((n) => guidesFor(serviceIdOf(n.path)))
    .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency])
    .slice(0, 6);
  const loc = `hub:${id}`;
  const intent = primaryCtaFor(node.intent);
  const Primary = intent === "PLANS" ? PlansLink : intent === "QUOTE" ? QuoteLink : BookLink;

  return (
    <article className={cn(page, "py-8 md:py-12")}>
      <Breadcrumbs items={nodeCrumbs(node.path)} />

      <header className="mt-6 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className={h1}>{node.title}</h1>
          <p className="mt-5 max-w-[68ch] text-lg text-muted">{hubLead[id]}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Primary location={`${loc}:hero`} className="btn-primary" />
            <ChatButton location={`${loc}:hero`} className="btn-secondary" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="aspect-[4/3] overflow-hidden rounded-[20px] shadow-card">
            <Photo id={hubPhotos[id]} decorative preload sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      </header>

      <Section id="services" title="What we do here">
        <LinkRows
          items={serviceChildren.map((n) => ({
            href: n.path,
            title: n.title,
            summary: getService(serviceIdOf(n.path))?.summary,
          }))}
        />
        {otherChildren.map((n) => (
          <p key={n.path} className="mt-4">
            <Link href={n.path} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
              {n.title}
            </Link>
          </p>
        ))}
      </Section>

      {topGuides.length > 0 && (
        <Section id="guides" title="Most urgent problems">
          <ul className="grid gap-3 sm:grid-cols-2">
            {topGuides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={routes.guide(g.slug)}
                  className="flex h-full items-center rounded-[20px] border border-line bg-surface px-5 py-4 font-medium hover:text-accent-text"
                >
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <Link href={routes.guides} className="font-semibold text-accent-text underline underline-offset-4 hover:no-underline">
              Every error we have written up
            </Link>
          </p>
        </Section>
      )}

      <section aria-labelledby="hub-closing" className="mt-16 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <h2 id="hub-closing" className={cn(h2, "max-w-[24ch]")}>
          {node.title}
        </h2>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Primary location={`${loc}:closing`} className="btn-primary" />
          <ChatButton location={`${loc}:closing`} className="btn-secondary" />
        </div>
      </section>
    </article>
  );
}
