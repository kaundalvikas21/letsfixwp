import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "high-server-load",
  title: "WordPress high CPU usage",
  h1: "Fix high server load on a WordPress site",
  errorText: "508 Resource Limit Is Reached",
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
  safeChecks: [
    "In cPanel Resource Usage or your host's dashboard, note the dates and times the limits were hit.",
    "Keep the host's warning emails as they are. They often name the exact limit and the time it was reached.",
  ],
  whenToCallUs:
    "If the host is throttling or suspending the site, the access logs and resource data have to be read together to see what is causing the load. Blocking bots, changing cron or editing server rules without that evidence can shut out real customers or Googlebot. Hand it to us before you upgrade the plan or block traffic by guesswork.",
  parentService: "speed-optimization",
  urgency: "standard",
  faqs: [
    { q: "Do I need a bigger hosting plan?", a: "Not necessarily. Much of the load on WordPress sites comes from bots, cron jobs and uncached requests. We cut that first, then tell you honestly if the plan is still too small." },
    { q: "Could my site be hacked?", a: "It is possible. Malware often runs spam or mining scripts that use CPU constantly. We check for that as part of the diagnosis." },
    { q: "Why does load spike at night when nobody is visiting?", a: "Backups, scheduled tasks and bots do not keep office hours. Night time spikes usually point to cron jobs, backup plugins or crawlers." },
    { q: "Will blocking bots hurt my SEO?", a: "Not when it is done carefully. We verify genuine search engine crawlers such as Googlebot and only block traffic that is abusive or fake." },
  ],
  seo: {
    title: "WordPress High CPU and Server Load Fix",
    description: "Host throttling your WordPress site or warning about resource limits? We find the bots, cron jobs and queries behind the load and bring it down.",
  },
  image: { slot: "illustration-high-server-load", alt: "A server resource graph with the CPU line pinned at the top of the chart" },
});
