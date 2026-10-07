import { citySlugs, hubIdOf, hubIds, nodeByPath, serviceIdOf, serviceIds, serviceNodes } from "../config/routes";
import { tokenize, type MatchCandidate } from "../lib/match-problem";
import { citiesList, comparesList, guidesList, servicesList } from "./all";
import { hubsList } from "./hubs";
import type { City, Compare, Guide, Hub, Service } from "./schema";

export const guides: Guide[] = guidesList;
export const services: Service[] = servicesList;
export const cities: City[] = [...citiesList].sort((a, b) => a.priority - b.priority);
export const compares: Compare[] = comparesList;
export const hubs: Hub[] = hubsList;

const bySlug = <T,>(list: T[], key: (t: T) => string, kind: string) => {
  const m = new Map(list.map((t) => [key(t), t]));
  if (m.size !== list.length) throw new Error(`Duplicate ${kind} slug`);
  return m;
};
const guideMap = bySlug(guides, (g) => g.slug, "guide");
const serviceMap = bySlug(services, (s) => s.id, "service");
const cityMap = bySlug(cities, (c) => c.slug, "city");
const compareMap = bySlug(compares, (c) => c.slug, "compare");
const hubMap = bySlug(hubs, (h) => h.id, "hub");

export const getGuide = (slug: string) => guideMap.get(slug);
export const getService = (id: string) => serviceMap.get(id);
export const getCity = (slug: string) => cityMap.get(slug);
export const getCompare = (slug: string) => compareMap.get(slug);
export const getHub = (id: string) => hubMap.get(id);
export const guidesFor = (serviceId: string) => guides.filter((g) => g.parentService === serviceId);

// ---- Integrity: fail the build on content that does not match SITEMAP or links to nothing. ----
const fail = (msg: string) => {
  throw new Error(`Content integrity: ${msg}`);
};
const isLinkable = (p: string) =>
  nodeByPath.has(p) ||
  (p.startsWith("/guides/") && guideMap.has(p.split("/")[2])) ||
  (p.startsWith("/compare/") && compareMap.has(p.split("/")[2]));

for (const n of serviceNodes) {
  const s = serviceMap.get(serviceIdOf(n.path));
  if (!s) fail(`SITEMAP service ${n.path} has no content file (expected id "${serviceIdOf(n.path)}")`);
  else {
    if (s.path !== n.path) fail(`service ${s.id} path ${s.path} != SITEMAP ${n.path}`);
    if (s.intent !== n.intent) fail(`service ${s.id} intent ${s.intent} != SITEMAP ${n.intent}`);
    if (s.hub !== hubIdOf(n.parentPath!)) fail(`service ${s.id} hub ${s.hub} != SITEMAP ${n.parentPath}`);
  }
}
if (services.length !== serviceNodes.length) fail("a service file has no SITEMAP leaf");
for (const s of services) {
  for (const g of s.guideSlugs) if (getGuide(g)?.parentService !== s.id) fail(`service ${s.id} lists guide ${g} that is not its child`);
  for (const p of s.relatedPaths) if (!isLinkable(p)) fail(`service ${s.id} relatedPath ${p} goes nowhere`);
}
for (const g of guides) if (!serviceIds.includes(g.parentService)) fail(`guide ${g.slug} parentService ${g.parentService} unknown`);
for (const slug of citySlugs) if (!cityMap.has(slug)) fail(`SITEMAP city ${slug} has no content file`);
for (const c of cities) {
  const node = nodeByPath.get(`/wordpress-development/cities/${c.slug}/`);
  if (!node) fail(`city ${c.slug} is not in SITEMAP`);
  else if (node.priority !== c.priority) fail(`city ${c.slug} priority ${c.priority} != SITEMAP ${node.priority}`);
  for (const id of c.servicesHighlighted) if (!serviceMap.has(id)) fail(`city ${c.slug} highlights unknown service ${id}`);
}

for (const id of hubIds) if (!hubMap.has(id)) fail(`SITEMAP hub ${id} has no entry in src/content/hubs.ts`);
for (const c of compares) if (!serviceMap.has(c.closestService)) fail(`compare ${c.slug} closestService ${c.closestService} unknown`);

/**
 * Lightweight search data for client islands (no zod, no full copy). head and body are pre-tokenized on the
 * server: it cuts the serialized payload and saves re-tokenising every candidate on each keystroke.
 */
const terms = (...parts: string[]) => [...new Set(tokenize(parts.join(" ")))].join(" ");
export const matchIndex: MatchCandidate[] = [
  ...guides.map((g) => ({
    guideSlug: g.slug,
    serviceSlug: g.parentService,
    head: terms(g.title, g.errorText ?? ""),
    body: terms(...g.symptoms),
  })),
  ...services.filter((s) => s.intent === "fix").map((s) => ({ serviceSlug: s.id, head: terms(s.title), body: terms(...s.symptoms) })),
];
