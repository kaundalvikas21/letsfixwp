import { SITEMAP, type SiteNode } from "./sitemap";

// Every internal link comes from here (docs/section-contract.md rule 16). Built from SITEMAP, so a
// link to a page that is not in the tree throws at build time instead of shipping a 404.

export type FlatNode = SiteNode & { parentPath: string | null };

const flatten = (n: SiteNode, parentPath: string | null = null): FlatNode[] => [
  { ...n, parentPath },
  ...(n.children ?? []).flatMap((c) => flatten(c, n.path)),
];

export const nodes: FlatNode[] = flatten(SITEMAP);
export const nodeByPath = new Map(nodes.map((n) => [n.path, n]));

const lastSegment = (path: string) => path.split("/").filter(Boolean).at(-1)!;

// Ids are the last path segment, prefixed with the hub where the bare segment would be ambiguous.
const SERVICE_ID_OVERRIDES: Record<string, string> = {
  "/woocommerce/fixes/": "woocommerce-fixes",
  "/woocommerce/development/": "woocommerce-development",
  "/wordpress-maintenance/woocommerce/": "maintenance-woocommerce",
};

export const serviceIdOf = (path: string) => SERVICE_ID_OVERRIDES[path] ?? lastSegment(path);
export const hubIdOf = (path: string) => lastSegment(path);

export const serviceNodes = nodes.filter((n) => n.kind === "service");
export const hubNodes = nodes.filter((n) => n.kind === "hub");
export const cityNodes = nodes.filter((n) => n.kind === "city").sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

const servicePath = new Map(serviceNodes.map((n) => [serviceIdOf(n.path), n.path]));
const hubPath = new Map(hubNodes.map((n) => [hubIdOf(n.path), n.path]));
const cityPath = new Map(cityNodes.map((n) => [lastSegment(n.path), n.path]));
if (servicePath.size !== serviceNodes.length) throw new Error("Duplicate service id in SITEMAP");

export const serviceIds = [...servicePath.keys()];
export const hubIds = [...hubPath.keys()];
export const citySlugs = [...cityPath.keys()];

const must = (map: Map<string, string>, id: string, kind: string) => {
  const p = map.get(id);
  if (!p) throw new Error(`routes: unknown ${kind} "${id}"`);
  return p;
};

const withQuery = (path: string, q: Record<string, string | undefined>) => {
  const s = new URLSearchParams(Object.entries(q).filter((e): e is [string, string] => !!e[1])).toString();
  return s ? `${path}?${s}` : path;
};

const page = (path: string) => {
  if (!nodeByPath.has(path)) throw new Error(`routes: "${path}" is not in SITEMAP`);
  return path;
};

export const routes = {
  home: page("/"),
  hub: (id: string) => must(hubPath, id, "hub"),
  service: (id: string) => must(servicePath, id, "service"),
  cities: page("/wordpress-development/cities/"),
  city: (slug: string) => must(cityPath, slug, "city"),
  guides: page("/guides/"),
  guide: (slug: string) => `/guides/${slug}/`,
  compares: page("/compare/"),
  compare: (slug: string) => `/compare/${slug}/`,
  pricing: page("/pricing/"),
  check: page("/free-site-check/"),
  reviews: page("/case-studies/"),
  about: page("/about/"),
  contact: page("/contact/"),
  contactThanks: "/contact/thanks/",
  legal: { terms: "/legal/terms/", privacy: "/legal/privacy/", guarantee: "/legal/guarantee/" },
  /** Booking flow on /contact/. */
  book: ({ service, guide, url }: { service?: string; guide?: string; url?: string } = {}) => {
    if (service) must(servicePath, service, "service");
    return withQuery(page("/contact/"), { service, guide, url });
  },
  quote: (service?: string) => {
    if (service) must(servicePath, service, "service");
    return withQuery(page("/contact/"), { service, type: "project" });
  },
  /** A plan's own page. Defaults to the care plans page. */
  plans: (service = "care-plans") => must(servicePath, service, "service"),
};

/** Utility routes that live outside SITEMAP on purpose (route test whitelist). */
export const utilityPaths = [routes.contactThanks, routes.legal.terms, routes.legal.privacy, routes.legal.guarantee];

/** Home first, then each ancestor down to the node. */
export const ancestry = (path: string): FlatNode[] => {
  const out: FlatNode[] = [];
  for (let n = nodeByPath.get(path); n; n = n.parentPath ? nodeByPath.get(n.parentPath) : undefined) out.unshift(n);
  return out;
};
