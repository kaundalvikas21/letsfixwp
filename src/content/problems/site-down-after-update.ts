import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "site-down-after-update",
  category: "down",
  title: "WordPress site down after update",
  h1: "Fix a WordPress site that went down after an update",
  symptoms: [
    "Right after clicking Update, the site shows \"There has been a critical error on this website.\"",
    "The site is a blank white page after a plugin, theme or core update",
    "Every page shows \"Briefly unavailable for scheduled maintenance. Check back in a minute.\"",
    "wp-admin will not load, so you cannot undo the update yourself",
    "The site broke overnight and you received an email listing automatic updates",
  ],
  likelyCauses: [
    "A plugin update that is not compatible with your WordPress or PHP version",
    "A theme or child theme relying on code the updated plugin or core removed",
    "An update interrupted partway, leaving a mix of old and new files",
    "Two plugins that clash once one of them is updated",
    "Automatic background updates applied without testing",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Match the time the site broke against update logs and the PHP error log to pin down which update caused it." },
    { verb: "Back up", detail: "Copy the current files and database first, so orders, posts and form entries since your last backup are kept." },
    { verb: "Repair", detail: "Roll back the offending update or fix the code it broke, finish any half-applied update, and bring the site back online." },
    { verb: "Verify", detail: "Test the home page, key pages, wp-admin, forms and checkout to confirm everything works on the current versions." },
    { verb: "Harden", detail: "Tell you which update failed and set you up to test future updates before they reach the live site." },
  ],
  safeChecks: [
    "Search the site admin email inbox for \"Your Site is Experiencing a Technical Issue\" or a list of automatic updates. Either one tells you which plugin or theme changed.",
    "If you know which plugin was updated, open your host's file manager, go to wp-content/plugins and rename that plugin's folder. This turns it off without deleting it or its settings.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Should I restore a backup?", a: "A full restore also rolls back any orders, posts or form entries made since the backup. Rolling back only the update that failed keeps all of that." },
    { q: "Can I just downgrade the plugin?", a: "Often yes, and it can be the quickest way back online. We check whether the old version has known security issues before leaving it in place." },
    { q: "Why did one update break the whole site?", a: "WordPress loads every active plugin and the theme on each request. If one of them hits a fatal PHP error, the whole page stops, not just that feature." },
    { q: "Should I turn off automatic updates?", a: "Turning them off avoids surprise breakage but leaves security fixes waiting. A better approach is updating on a schedule and testing first, which we can explain for your site." },
  ],
  relatedSlugs: ["failed-core-update", "plugin-conflict", "stuck-in-maintenance-mode", "critical-error-on-this-website"],
  seo: {
    title: "WordPress Site Down After an Update? | FixMyWP",
    description: "Site broke after a plugin, theme or WordPress update? We find the update that failed, roll it back or fix it, and keep orders and posts made since.",
  },
  image: { slot: "illustration-site-down-after-update", alt: "A WordPress updates screen next to a browser showing a broken site" },
});
