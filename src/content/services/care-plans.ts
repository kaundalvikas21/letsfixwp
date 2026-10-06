import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "care-plans",
  path: "/wordpress-maintenance/care-plans/",
  hub: "wordpress-maintenance",
  intent: "plan",
  title: "WordPress maintenance plans",
  h1: "WordPress care plans that keep your site updated, backed up and watched",
  summary:
    "A monthly plan where we handle updates, backups, monitoring and security checks on your WordPress site, so problems are caught before your visitors find them.",
  whoItsFor:
    "Business owners and teams who rely on a WordPress site but do not want to spend their own time on updates, backups and fixing whatever an update breaks.",
  symptoms: [],
  whatWeDo: [
    { verb: "Update", detail: "Update WordPress core, themes and plugins after a fresh backup, then check the key pages and forms still work." },
    { verb: "Back up", detail: "Run scheduled backups of files and database, stored away from your hosting server so one failure cannot take out both." },
    { verb: "Monitor", detail: "Watch uptime, SSL expiry and security scan results so an outage or infection is spotted early." },
    { verb: "Fix", detail: "Handle small fixes and content changes within the limits of your plan, and flag anything bigger before work starts." },
    { verb: "Report", detail: "Send a regular report listing what was updated, what was backed up and anything that needs your decision." },
  ],
  deliverables: [
    "Scheduled core, theme and plugin updates with a backup taken before each round",
    "Off-server backups of files and database with tested restores",
    "Uptime, SSL and security monitoring with alerts acted on by us",
    "A regular maintenance report in plain language",
    "A clear list of what each tier includes, published on the pricing page",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "What is the difference between Basic, Pro and Business?", a: "The tiers differ in how much is covered, such as update frequency, backup retention and how much fix time is included. The current tiers and what each includes are listed on the pricing page." },
    { q: "Do you test updates before applying them?", a: "Yes. We take a backup first, apply updates, then check the home page, forms, logins and checkout if you have one. If an update breaks something, we roll it back and fix the cause." },
    { q: "Do I need to move my hosting to join a plan?", a: "No. We work with the hosting you already have, as long as we can get WordPress admin and hosting or SFTP access." },
    { q: "What happens if my site gets hacked while on a plan?", a: "Monitoring is meant to catch it early. If it does happen, we restore from a clean backup or clean the site, and tell you what was found and how it got in." },
    { q: "Is a care plan better than paying per job?", a: "It depends on how often you need help. Sites that change often or earn money usually suit a plan, while rarely changed sites may suit pay-as-you-go hours. Our comparison page sets out both." },
  ],
  guideSlugs: [],
  relatedPaths: [
    "/compare/care-plan-vs-pay-as-you-go-support/",
    "/pricing/",
    "/wordpress-maintenance/support-hours/",
    "/wordpress-security/audit-hardening/",
  ],
  seo: {
    title: "WordPress Maintenance Plans: Updates, Backups, Monitoring",
    description: "Monthly WordPress care plans covering updates, off-server backups, uptime and security monitoring, small fixes and plain-language reports.",
  },
  image: { slot: "service-care-plans", alt: "WordPress dashboard Updates screen listing plugin and theme updates ready to install" },
});
