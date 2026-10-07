import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "site-down-after-update",
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
  safeChecks: [
    "Search the site admin email inbox for \"Your Site is Experiencing a Technical Issue\" or a list of automatic updates. Either one tells you which plugin or theme changed.",
    "If you know which plugin was updated, open your host's file manager, go to wp-content/plugins and rename that plugin's folder. This turns it off without deleting it or its settings.",
  ],
  whenToCallUs:
    "If renaming the plugin folder does not bring the site back, or you cannot tell which update caused it, stop there. Restoring a full backup or deleting plugins at this point can lose recent orders, posts and settings. That is when an engineer should read the error log and roll back only what failed.",
  parentService: "emergency",
  urgency: "critical",
  faqs: [
    { q: "Should I restore a backup?", a: "A full restore also rolls back any orders, posts or form entries made since the backup. Rolling back only the update that failed keeps all of that." },
    { q: "Can I just downgrade the plugin?", a: "Often yes, and it can be the quickest way back online. We check whether the old version has known security issues before leaving it in place." },
    { q: "Why did one update break the whole site?", a: "The new version may need a newer PHP release, or call code that your theme or another plugin does not provide. Because WordPress loads all active plugins on every page, a fatal error in the updated one stops the entire site." },
    { q: "Should I turn off automatic updates?", a: "Turning them off avoids surprise breakage but leaves security fixes waiting. A better approach is updating on a schedule and testing first, which we can explain for your site." },
  ],
  seo: {
    title: "WordPress Site Down After an Update?",
    description: "Site broke after a plugin, theme or WordPress update? We find the update that failed, roll it back or fix it, and keep orders and posts made since.",
  },
  image: { slot: "illustration-site-down-after-update", alt: "A WordPress updates screen next to a browser showing a broken site" },
});
