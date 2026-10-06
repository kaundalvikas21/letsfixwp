import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "high-server-load",
  category: "performance",
  title: "WordPress high CPU usage",
  h1: "Fix high server load on a WordPress site",
  symptoms: [
    "Your host emails that the account has hit its resource limits, or that CPU is being throttled",
    "Visitors get \"508 Resource Limit Is Reached\" or \"503 Service Unavailable\" at busy times",
    "The Resource Usage page in cPanel shows CPU, entry processes or I/O pinned at the limit",
    "The host suspends the site or pushes you to upgrade your plan",
  ],
  likelyCauses: [
    "Bots and scrapers hammering pages, or brute force attempts against wp-login.php and xmlrpc.php",
    "WP-Cron running heavy scheduled jobs on page loads, or a backlog of failed scheduled tasks",
    "Frequent admin-ajax.php calls from the Heartbeat API, open dashboards or plugins",
    "Uncached pages, WooCommerce cart fragments and product filters sending heavy queries to the database",
    "Malware or spam scripts running on the server and using CPU in the background",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Read the access logs, slow query log and resource graphs to see which requests and processes use the CPU." },
    { verb: "Back up", detail: "Copy files and database before changing any configuration." },
    { verb: "Optimize", detail: "Block abusive bots and login floods, move WP-Cron to a real server cron, limit Heartbeat and add caching for the heaviest pages." },
    { verb: "Verify", detail: "Watch the host's resource graphs over the following days and confirm real search engine crawlers and customers are not blocked." },
    { verb: "Harden", detail: "Scan for malware, close xmlrpc.php if you do not use it and tell you whether your current plan is genuinely too small." },
  ],
  safeChecks: [
    "In cPanel Resource Usage or your host's dashboard, note the dates and times the limits were hit.",
    "Keep the host's warning emails as they are. They often name the exact limit and the time it was reached.",
  ],
  urgency: "standard",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Do I need a bigger hosting plan?", a: "Not necessarily. Much of the load on WordPress sites comes from bots, cron jobs and uncached requests. We cut that first, then tell you honestly if the plan is still too small." },
    { q: "Could my site be hacked?", a: "It is possible. Malware often runs spam or mining scripts that use CPU constantly. We check for that as part of the diagnosis." },
    { q: "Why does load spike at night when nobody is visiting?", a: "Backups, scheduled tasks and bots do not keep office hours. Night time spikes usually point to cron jobs, backup plugins or crawlers." },
    { q: "Will blocking bots hurt my SEO?", a: "Not when it is done carefully. We verify genuine search engine crawlers such as Googlebot and only block traffic that is abusive or fake." },
  ],
  relatedSlugs: ["slow-wordpress-site", "503-service-unavailable", "malware-removal", "core-web-vitals-failing"],
  seo: {
    title: "WordPress High CPU and Server Load Fix | FixMyWP",
    description: "Host throttling your WordPress site or warning about resource limits? We find the bots, cron jobs and queries behind the load and bring it down.",
  },
  image: { slot: "illustration-high-server-load", alt: "A server resource graph with the CPU line pinned at the top of the chart" },
});
