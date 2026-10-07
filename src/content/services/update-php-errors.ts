import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "update-php-errors",
  path: "/wordpress-fix/update-php-errors/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress broken after PHP update",
  h1: "Fix WordPress after a PHP upgrade or failed core update",
  heroLine: "Your host changed PHP versions or a core update stopped halfway. We fix the old code or finish the update.",
  summary:
    "Hosts move sites to newer PHP versions, and old plugin or theme code that relied on removed functions stops working. Core updates can also fail halfway. We fix the incompatible code or finish the update so the site runs on a current, supported PHP version.",
  whoItsFor:
    "Owners whose site broke after their host changed the PHP version, or whose WordPress core update failed or never finished.",
  symptoms: [
    "The site broke after your host switched PHP, for example from 7.4 to 8.x",
    "Deprecated or warning messages print across the top of your pages",
    "\"An automated WordPress update has failed to complete\" in wp-admin or your inbox",
    "\"Another update is currently in progress.\" when you try to update",
    "Site Health warns that your site runs an outdated PHP version",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Read the PHP error log and scan plugins and themes for code that newer PHP versions removed or treat as fatal." },
    { verb: "Back up", detail: "Copy files and database before changing PHP versions or replacing core files." },
    { verb: "Repair", detail: "Update or patch incompatible code, replace abandoned plugins, and reinstall clean core files when a core update stopped halfway." },
    { verb: "Verify", detail: "Run the site on the target PHP version and test the front end, wp-admin, forms and checkout." },
    { verb: "Report", detail: "List what was changed and any plugin that still needs replacing before the next PHP upgrade." },
  ],
  deliverables: [
    "The site working on a supported PHP version",
    "WordPress core on a complete, clean install of the current version",
    "Backups taken before the fix",
    "A written list of incompatible plugins and what we did with each",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why did a PHP upgrade break my site?", a: "PHP 8 removed functions such as create_function() and each() and turned many old warnings into fatal errors. Plugins and themes that were not updated for it stop with an error." },
    { q: "Can I just switch back to the old PHP version?", a: "It can bring the site back for now, but old PHP versions no longer receive security fixes and hosts eventually remove them. It buys time to fix the code, it does not replace the fix." },
    { q: "What does \"Another update is currently in progress\" mean?", a: "WordPress stores a lock in the database while it updates core. If an update dies, the lock stays until it expires, and WordPress refuses new updates until then. Clearing the lock without checking the half finished update can leave mixed versions." },
    { q: "What if a plugin has no PHP 8 version?", a: "We patch it if the change is small and safe, or move you to a maintained plugin that does the same job and migrate its settings where possible." },
  ],
  guideSlugs: ["php-upgrade-broke-site", "failed-core-update"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/plugin-theme-conflict/", "/guides/php-upgrade-broke-site/", "/guides/failed-core-update/"],
  seo: {
    title: "WordPress Broken After PHP or Core Update",
    description: "Site broke after a PHP version change or a failed WordPress update? We fix incompatible plugin and theme code and finish the update on supported PHP.",
  },
  image: { slot: "service-update-php-errors", photo: "keys", alt: "A hosting control panel PHP version selector next to WordPress deprecated notices" },
});
