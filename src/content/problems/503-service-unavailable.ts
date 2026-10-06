import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "503-service-unavailable",
  category: "down",
  title: "WordPress 503 service unavailable",
  h1: "Fix the 503 service unavailable error in WordPress",
  symptoms: [
    "The page shows \"503 Service Unavailable\" or \"Service Temporarily Unavailable\"",
    "The message reads \"The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.\"",
    "The site goes down at busy times and comes back on its own",
    "wp-admin is extremely slow or times out before showing the 503",
  ],
  likelyCauses: [
    "All PHP workers busy, so the server turns new requests away",
    "A plugin, cron job or background task running in a loop and holding the server",
    "Bot traffic, brute force login attempts or xmlrpc.php abuse flooding the site",
    "The hosting plan's CPU, memory or process limits being reached",
    "The host carrying out maintenance or restarting services",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Check access logs, PHP logs and resource usage to find what is filling the server: a plugin, a cron task, a crawler or an attack." },
    { verb: "Back up", detail: "Take a copy of files and database before making changes, so the site can be rolled back if needed." },
    { verb: "Repair", detail: "Stop the runaway process, fix or replace the plugin behind it, and block abusive traffic at the server or firewall level." },
    { verb: "Verify", detail: "Watch the server under normal traffic and confirm pages, wp-admin and checkout respond without 503s." },
    { verb: "Harden", detail: "Add caching and bot protection where it fits, and tell you plainly if the hosting plan itself is too small for the site." },
  ],
  safeChecks: [
    "Check your host's status page for maintenance or an outage in your region. If the host is working on the server, the 503 will clear when they finish.",
    "Look in your hosting control panel for a resource usage or CPU graph. A flat line at the top of the chart points to the site hitting its plan limits.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Is a 503 the same as a 500 error?", a: "No. A 500 means something broke. A 503 means the server is too busy or unavailable to answer right now. The fixes are different, so it matters which one you see." },
    { q: "Will it fix itself?", a: "If it was host maintenance or a short traffic burst, yes. If it keeps coming back, something on the site or in the traffic is overloading the server and it will return until that is fixed." },
    { q: "Do I need a bigger hosting plan?", a: "Sometimes, but often not. A single bad plugin or unblocked bot traffic can overload a plan that is otherwise big enough. We find the cause before suggesting an upgrade." },
    { q: "Does a 503 hurt my Google rankings?", a: "A short 503 is treated by Google as temporary. Repeated or long lasting 503s can lead to pages dropping out of the index, so recurring errors should be fixed." },
  ],
  relatedSlugs: ["high-server-load", "slow-wordpress-site", "plugin-conflict", "stuck-in-maintenance-mode"],
  seo: {
    title: "Fix WordPress 503 Service Unavailable | FixMyWP",
    description: "WordPress showing 503 Service Unavailable? We find the plugin, cron task or traffic overloading your server, stop it and get the site responding again.",
  },
  image: { slot: "illustration-503-service-unavailable", alt: "A browser window showing a 503 Service Unavailable message on a WordPress site" },
});
