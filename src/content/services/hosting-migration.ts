import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "hosting-migration",
  path: "/wordpress-performance-migration/hosting-migration/",
  hub: "wordpress-performance-migration",
  intent: "project",
  title: "WordPress migration to new hosting",
  h1: "Move your WordPress site to a new host or server",
  heroLine: "Changing hosts or servers? We move the whole site, test it on the new server, then switch DNS.",
  summary:
    "We move your WordPress files, database, email settings and SSL to the new host, test everything there before DNS changes, and keep the old site intact until the new one is confirmed working.",
  whoItsFor:
    "Site owners changing hosting provider, moving from shared hosting to a VPS or cloud server, or changing domain name.",
  symptoms: [],
  whatWeDo: [
    { verb: "Audit", detail: "List the PHP version, extensions, cron jobs, email setup and DNS records the site depends on today." },
    { verb: "Migrate", detail: "Copy files and database to the new server and run a serialization-safe URL replacement with WP-CLI." },
    { verb: "Test", detail: "Check pages, forms, logins, SSL, images and checkout on the new server through a temporary URL or hosts file entry." },
    { verb: "Launch", detail: "Lower DNS TTL in advance, switch DNS, issue SSL and fix any mixed content warnings that appear." },
    { verb: "Monitor", detail: "Watch the site and error logs after the switch and tell you when it is safe to cancel the old hosting." },
  ],
  deliverables: [
    "A complete copy of the site running on the new server",
    "SSL installed and HTTPS working without mixed content warnings",
    "DNS records moved, including MX records so email keeps arriving",
    "Redirects in place if the domain or URL structure changes",
    "A backup of the original site kept until the move is confirmed",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Will my site go down during the move?", a: "The old site keeps serving visitors while we build and test the new copy. The only change visitors notice is DNS switching over, and both servers serve the same content while that happens." },
    { q: "What about my email?", a: "If your email is hosted with your current host, the MX records and mailboxes need planning before DNS changes. We check this first so email is not lost." },
    { q: "Do orders or comments made during the move get lost?", a: "For stores and busy sites we take a final copy of the database just before the switch, or pause orders briefly, so nothing created on the old server is left behind." },
    { q: "Can you move my site to a new domain as well?", a: "Yes. We update every stored URL safely and set up 301 redirects from each old page to its new address, which preserves rankings when mapped page to page." },
    { q: "Why do I see a padlock warning after moving?", a: "That is usually mixed content, where pages still load images or scripts over HTTP. We fix the stored URLs so every resource loads over HTTPS." },
  ],
  guideSlugs: ["mixed-content-ssl-errors"],
  relatedPaths: [
    "/guides/mixed-content-ssl-errors/",
    "/wordpress-fix/site-recovery/",
    "/wordpress-performance-migration/speed-optimization/",
  ],
  seo: {
    title: "WordPress Hosting Migration: Move to a New Server Safely",
    description: "We move WordPress files, database, SSL, DNS and email records to your new host, test before switching and keep the old site until it is confirmed.",
  },
  image: { slot: "service-hosting-migration", photo: "racks", alt: "Terminal window running WP-CLI search-replace during a WordPress server migration" },
});
