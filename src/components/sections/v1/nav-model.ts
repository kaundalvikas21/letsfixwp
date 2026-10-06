import { hubNodes, nodeByPath, nodes, routes, serviceIdOf } from "@/config/routes";
import { getService } from "@/content";

// V1 nav data, built on the server from SITEMAP and content and passed to the client menus as plain props.

export type NavLeaf = { title: string; href: string; line?: string };
export type NavGroup = { id: string; label: string; links: NavLeaf[]; all?: { label: string; href: string }; prefixes: string[] };
export type NavEntry = ({ kind: "link"; label: string; href: string } | ({ kind: "panel"; columns: 1 | 2 } & NavGroup));

/** First sentence of a service summary; the panel clamps it to one line. */
const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];

const hubGroup = (hubId: string, label: string, allLabel: string): NavGroup => {
  const hub = routes.hub(hubId);
  const links = nodes
    .filter((n) => n.parentPath === hub && n.kind === "service")
    .map((n) => ({ title: n.title, href: n.path, line: firstSentence(getService(serviceIdOf(n.path))!.summary) }));
  return { id: hubId, label, links, all: { label: allLabel, href: hub }, prefixes: [hub] };
};

const titleOf = (path: string) => nodeByPath.get(path)!.title;

/** Desktop center items (V1 SYNC): Fixes, Security, Care plans, Pricing, More. */
export const desktopNav = (): NavEntry[] => {
  const more = [
    routes.hub("wordpress-performance-migration"),
    routes.hub("wordpress-development"),
    routes.hub("woocommerce"),
    routes.guides,
    routes.reviews,
  ];
  return [
    { kind: "panel", columns: 2, ...hubGroup("wordpress-fix", "Fixes", "All fixes") },
    { kind: "panel", columns: 2, ...hubGroup("wordpress-security", "Security", "All security services") },
    { kind: "link", label: "Care plans", href: routes.hub("wordpress-maintenance") },
    { kind: "link", label: "Pricing", href: routes.pricing },
    {
      kind: "panel",
      columns: 1,
      id: "more",
      label: "More",
      links: more.map((p) => ({ title: titleOf(p), href: p })),
      prefixes: more,
    },
  ];
};

const SHORT: Record<string, [label: string, all: string]> = {
  "wordpress-fix": ["Fixes", "All fixes"],
  "wordpress-security": ["Security", "All security services"],
  "wordpress-maintenance": ["Care plans", "All care plans"],
  "wordpress-performance-migration": ["Performance & Migration", "All performance and migration services"],
  "wordpress-development": ["WordPress Development", "All development services"],
  woocommerce: ["WooCommerce", "All WooCommerce services"],
};

/** Sheet below lg: every hub as an accordion, then the standalone pages. */
export const mobileNav = () => ({
  hubs: hubNodes.map((h) => {
    const id = h.path.split("/")[1];
    const [label, all] = SHORT[id] ?? [h.title, `All ${h.title}`];
    return hubGroup(id, label, all);
  }),
  pages: [routes.pricing, routes.guides, routes.reviews].map((p) => ({ title: titleOf(p), href: p })),
});
