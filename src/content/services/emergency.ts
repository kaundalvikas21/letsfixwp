import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "emergency",
  path: "/wordpress-fix/emergency/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress emergency fix",
  h1: "Emergency fix for a WordPress site that is down",
  heroLine: "Your site is down or stuck on maintenance. We find what broke it and bring it back online.",
  summary:
    "Your WordPress site went down after an update, is stuck on the maintenance message, or simply stopped loading. We find the change that took it offline, bring it back and keep the orders, posts and form entries made since your last backup.",
  whoItsFor:
    "Owners whose site is offline right now and who cannot get into wp-admin to undo whatever changed.",
  symptoms: [
    "Every page shows \"Briefly unavailable for scheduled maintenance. Check back in a minute.\"",
    "The site broke right after you clicked Update on a plugin, theme or WordPress itself",
    "wp-admin will not load, so you cannot roll anything back yourself",
    "The admin inbox has an email titled \"Your Site is Experiencing a Technical Issue\"",
    "Customers are telling you the site will not open",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Read the PHP error log and match the time the site broke against update logs to find the change that took it down." },
    { verb: "Back up", detail: "Copy the current files and database before touching anything, so nothing added since your last backup is lost." },
    { verb: "Repair", detail: "Roll back or fix the failed update, clear a stuck .maintenance file and finish any update that was left half applied." },
    { verb: "Verify", detail: "Test the home page, wp-admin, forms and checkout on the live site once it is back." },
    { verb: "Report", detail: "Tell you what failed, what we changed and how to test the next update before it reaches the live site." },
  ],
  deliverables: [
    "Your site back online with the cause fixed, not hidden",
    "Backups of files and database taken before any change",
    "A written note of what broke and what we changed",
    "A list of plugins, themes or settings that still need attention",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Should I restore a backup?", a: "A full restore also rolls back any orders, posts or form entries made since the backup. Rolling back only the update that failed keeps all of that, so we try that first." },
    { q: "Why is my site stuck on the maintenance message?", a: "WordPress creates a .maintenance file in the site root while it applies updates and deletes it when they finish. If the update is interrupted, the file stays and every visitor sees the message. Deleting it ends the message, but the half finished update still needs checking." },
    { q: "Why did one update break the whole site?", a: "WordPress loads every active plugin and the theme on each request. If one of them hits a fatal PHP error, the whole page stops, not just that feature." },
    { q: "What access do you need?", a: "Hosting control panel or SFTP access, plus a WordPress admin login if wp-admin still loads. When wp-admin is down we work from hosting access alone." },
    { q: "Should I turn off automatic updates?", a: "Turning them off avoids surprise breakage but leaves security fixes waiting. Updating on a schedule and testing on a staging copy first is the safer middle ground." },
  ],
  guideSlugs: ["site-down-after-update", "stuck-in-maintenance-mode"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/critical-error/", "/guides/site-down-after-update/", "/guides/stuck-in-maintenance-mode/"],
  seo: {
    title: "Emergency WordPress Fix for a Site That Is Down",
    description: "WordPress site down after an update or stuck in maintenance mode? We find the change that broke it and bring the site back without losing recent data.",
  },
  image: { slot: "service-emergency", alt: "A browser showing the WordPress \"Briefly unavailable for scheduled maintenance\" message" },
});
