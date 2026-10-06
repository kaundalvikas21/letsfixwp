import { nodes, routes, serviceIdOf } from "@/config/routes";
import { getService, guides, guidesFor, matchIndex } from "@/content";
import type { Guide, Service } from "@/content/schema";
import { FinderClient, type FinderRow, type FinderTab, type SearchGuide } from "./FinderClient";

const rank = { critical: 0, high: 1, standard: 2 } as const;

/** The most urgent of a service's guides speaks for the service. */
const urgencyOf = (s: Service) =>
  guidesFor(s.id).sort((a, b) => rank[a.urgency] - rank[b.urgency])[0]?.urgency;

const serviceRow = (s: Service): FinderRow => ({
  key: s.id,
  title: s.title,
  line: s.symptoms[0] ?? s.summary,
  urgency: urgencyOf(s),
  href: routes.service(s.id),
});

const guideRow = (g: Guide): FinderRow => ({
  key: g.slug,
  title: g.title,
  line: g.symptoms[0],
  urgency: g.urgency,
  href: routes.guide(g.slug),
});

const servicesUnder = (hubId: string, fixOnly = false) =>
  nodes
    .filter((n) => n.parentPath === routes.hub(hubId) && n.kind === "service" && (!fixOnly || n.intent === "fix"))
    .map((n) => getService(serviceIdOf(n.path))!);

// Emergency-first, built from SITEMAP: the fix hub, the security hub's fix services, then two guide sets.
const tabs: FinderTab[] = [
  { id: "down", label: "Site down and errors", rows: servicesUnder("wordpress-fix").map(serviceRow) },
  { id: "security", label: "Hacked and security", rows: servicesUnder("wordpress-security", true).map(serviceRow) },
  { id: "woocommerce", label: "WooCommerce", rows: guidesFor("woocommerce-fixes").map(guideRow) },
  { id: "speed", label: "Speed", rows: guidesFor("speed-optimization").map(guideRow) },
];

const searchGuides: Record<string, SearchGuide> = Object.fromEntries(
  guides.map((g) => [g.slug, { title: g.title, href: routes.guide(g.slug), service: g.parentService }]),
);

/**
 * V1.4, the core conversion section. Layout family: vertical tab index.
 * Eyebrow (the page's first), H2, search, then tabs: vertical on the left from 768px with a 2-column row list,
 * a horizontal scroll-snap row with a single-column list under 768px. Footer: CHAT and the guides index.
 */
export function ProblemFinder() {
  return (
    <section aria-labelledby="finder-title" className="border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <p className="font-mono text-[13px] text-muted">Common emergencies</p>
        <h2 id="finder-title" className="mt-3 text-[clamp(1.875rem,1.4rem+2vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-text">
          Find your problem. Book the fix.
        </h2>
        <FinderClient tabs={tabs} index={matchIndex} guides={searchGuides} guidesHref={routes.guides} />
      </div>
    </section>
  );
}
