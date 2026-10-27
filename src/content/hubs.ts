import { hubIds } from "../config/routes";

/**
 * One lead paragraph per SITEMAP hub. A hub has a route node but no content file, so its page would otherwise
 * have no prose of its own. Each describes only the services that sit under that hub, and no two repeat a line.
 */
export const hubLead: Record<string, string> = {
  "wordpress-fix":
    "When a site stops loading, the cause is almost always one failing plugin, theme or setting, hidden behind a blank page or a short error message. These pages cover each error WordPress shows, what sits behind it, and how we get the site serving pages again.",
  "wordpress-security":
    "A hacked WordPress site usually keeps working, which is why most owners find out from a visitor, their host or a Google warning. Cleaning one means removing every infected file and account, closing the way in, and getting the warnings lifted.",
  "wordpress-maintenance":
    "Most emergencies start with an update nobody tested or a backup nobody checked. A care plan moves that work to a schedule: updates applied after a backup, restores tested, and someone watching the site between visits.",
  "wordpress-performance-migration":
    "Slow pages and risky moves share a cause, which is guesswork. We measure where a site actually loses time before changing anything, and when a site has to move host or platform, we build and test the copy before any traffic sees it.",
  "wordpress-development":
    "Work that adds to a site rather than repairs it: a new design, a theme or plugin built for one job, an ongoing developer, or the search work that gets the result found. Each project starts from what the site has to do, not from a template.",
  woocommerce:
    "A store has more to break than a site: checkout, payment gateways, tax settings and order emails all have to work together. These pages cover building a WooCommerce store, fixing one that has stopped taking orders, and the Indian payment and GST setup behind it.",
};

for (const id of hubIds) if (!hubLead[id]) throw new Error(`hubs: hub "${id}" has no lead paragraph`);
