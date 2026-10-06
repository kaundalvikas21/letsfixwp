// Runs after `next build` (npm run build). Fails if a SITEMAP path has no built route, or a built route has no
// SITEMAP entry. Guide and compare items and the utility routes are the only allowed extras.
import { readFileSync } from "node:fs";
import { nodes, routes, utilityPaths } from "../src/config/routes";
import { compares, guides } from "../src/content";

const read = (f: string) => JSON.parse(readFileSync(`.next/${f}`, "utf8"));
const slash = (p: string) => (p.endsWith("/") ? p : `${p}/`);
const isMeta = (p: string) => /^\/(_not-found|_global-error|favicon\.ico|sitemap\.xml|robots\.txt)\/?$/.test(p) || p.includes("opengraph-image");

// Concrete prerendered paths (static pages and generateStaticParams output) plus static app routes rendered on demand.
const prerendered = Object.keys(read("prerender-manifest.json").routes);
const appRoutes = Object.values(read("app-path-routes-manifest.json") as Record<string, string>).filter((r) => !r.includes("["));
const built = new Set([...prerendered, ...appRoutes].filter((p) => !isMeta(p)).map(slash));

const sitemap = new Set(nodes.map((n) => n.path));
const allowedExtras = new Set([
  ...guides.map((g) => routes.guide(g.slug)),
  ...compares.map((c) => routes.compare(c.slug)),
  ...utilityPaths,
]);

const missing = [...sitemap].filter((p) => !built.has(p));
const orphans = [...built].filter((p) => !sitemap.has(p) && !allowedExtras.has(p));
const missingItems = [...allowedExtras].filter((p) => !utilityPaths.includes(p) && !built.has(p));

if (missing.length || orphans.length || missingItems.length) {
  if (missing.length) console.error(`SITEMAP paths with no route:\n  ${missing.join("\n  ")}`);
  if (orphans.length) console.error(`Routes with no SITEMAP entry:\n  ${orphans.join("\n  ")}`);
  if (missingItems.length) console.error(`Guide/compare items not built:\n  ${missingItems.join("\n  ")}`);
  process.exit(1);
}
console.log(`route test ok: ${built.size} routes (${sitemap.size} SITEMAP nodes, ${guides.length} guides, ${compares.length} compares, utility ${[...built].filter((p) => utilityPaths.includes(p)).length})`);
