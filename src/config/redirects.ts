import type { Redirect } from "next/dist/lib/load-custom-routes";
import { guides } from "../content";
import { brand } from "./brand";
import { routes } from "./routes";
import { SITE_URL } from "./sitemap";

// Old foundation slugs that changed: /fix/<old>/ resolves through the guide it became.
const RENAMED: Record<string, string> = { hacked: "wordpress-hacked" };
// Old slugs folded into a service rather than a guide.
const FOLDED: Record<string, string> = { "malware-removal": "malware-removal" };
// Guides that never had a /fix/ URL.
const NEW_GUIDES = new Set(["502-bad-gateway"]);

const guideParent = new Map(guides.map((g) => [g.slug, g.parentService]));
const oldFixSlugs = [
  ...guides.filter((g) => !NEW_GUIDES.has(g.slug)).map((g) => Object.entries(RENAMED).find(([, n]) => n === g.slug)?.[0] ?? g.slug),
  ...Object.keys(FOLDED),
];
/** Service id for a foundation-era problem slug (used by /fix/<old>/ redirects and the old /app?problem= param). */
export const serviceForOldSlug = (old: string) => FOLDED[old] ?? guideParent.get(RENAMED[old] ?? old);

/** Shared links from the first foundation keep working (always on). */
const foundationRedirects: Redirect[] = [
  { source: "/fix", destination: routes.hub("wordpress-fix"), permanent: true },
  ...oldFixSlugs.map((old) => ({ source: `/fix/${old}`, destination: routes.service(serviceForOldSlug(old)!), permanent: true })),
  { source: "/app", destination: routes.contact, permanent: true }, // query string passes through
];

/**
 * fixmywp.com paths, only when brand.legacy.enabled (docs/foundation.md, LEGACY REDIRECTS).
 * Host-matched so they fire only for requests to the old domain served by this deployment.
 * Host-level alternative: point fixmywp.com at a redirect-only host (Cloudflare Redirect Rules or an
 * nginx `server` block) that returns 301 for these paths and sends everything else to SITE_URL.
 */
const legacyTable: [string, string][] = [
  ["/wordpress-hacked-fix", routes.service("malware-removal")],
  ["/fix-wordpress-theme", routes.service("plugin-theme-conflict")],
  ["/fix-wordpress-plugin", routes.service("plugin-theme-conflict")],
  ["/wordpress-maintenance-services", routes.service("care-plans")],
  ["/testimonials", routes.reviews],
  ["/app", routes.contact],
];
const oldHosts = ["fixmywp.com", "www.fixmywp.com"];

const legacyRedirects: Redirect[] = brand.legacy.enabled
  ? oldHosts.flatMap((host) =>
      legacyTable.map(([source, dest]) => ({
        source,
        has: [{ type: "host" as const, value: host }],
        destination: `${SITE_URL}${dest}`,
        statusCode: 301 as const,
      })),
    )
  : [];

// Host-matched legacy rules first so they win over the generic /app rule on the old domain.
export const redirects: Redirect[] = [...legacyRedirects, ...foundationRedirects];
export const legacyRedirectTable = legacyTable;
