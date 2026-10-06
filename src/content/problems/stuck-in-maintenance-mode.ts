import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "stuck-in-maintenance-mode",
  category: "down",
  title: "WordPress stuck in maintenance mode",
  h1: "Fix WordPress stuck in maintenance mode",
  symptoms: [
    "Every page shows \"Briefly unavailable for scheduled maintenance. Check back in a minute.\"",
    "The message is still there long after the update should have finished",
    "wp-admin shows the same maintenance message, so you cannot log in",
    "The Updates screen says \"Another update is currently in progress.\"",
  ],
  likelyCauses: [
    "A .maintenance file left in the WordPress root folder by an update that did not finish",
    "The browser tab being closed or the connection dropping during an update",
    "The server timing out partway through a bulk plugin or core update",
    "A page cache still serving the maintenance page after the update ended",
    "An update lock left in the database, blocking further updates",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Check for a leftover .maintenance file, update locks and cached pages, and find which update was running when it stopped." },
    { verb: "Back up", detail: "Copy files and database before clearing anything, because an interrupted update can leave plugins or core half replaced." },
    { verb: "Repair", detail: "Clear the maintenance state, finish or roll back the interrupted update, and replace any files that were only partly written." },
    { verb: "Verify", detail: "Load the site logged out and logged in, purge caches, and confirm every updated plugin and the theme work properly." },
    { verb: "Harden", detail: "Explain why the update stalled, such as a server timeout, and suggest how to run future updates so it does not repeat." },
  ],
  safeChecks: [
    "In your host's file manager, turn on Show hidden files and look in the main WordPress folder for a file named .maintenance. Rename it to .maintenance-old rather than deleting it, then reload the site.",
    "Open the site in a private browser window. If the message is gone there, a cache is serving the old page, and clearing your caching plugin or host cache will fix it.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why is my site stuck on this message?", a: "WordPress creates a temporary .maintenance file while it updates and removes it when it finishes. If the update is interrupted, the file or a cached copy of the message can be left behind." },
    { q: "Is it safe to remove the .maintenance file?", a: "Clearing it is the standard fix, but the update that was running may not have completed. That can leave a plugin or core half updated, so the site should be checked afterwards." },
    { q: "The message is gone but the site is broken. Why?", a: "The interrupted update probably left a mix of old and new files. The plugin or core files need to be reinstalled cleanly to match one version." },
    { q: "How do I stop this happening again?", a: "Update plugins in smaller groups, keep the browser tab open until updates finish, and avoid updating during busy times on a server that is already slow." },
  ],
  relatedSlugs: ["site-down-after-update", "failed-core-update", "503-service-unavailable", "plugin-conflict"],
  seo: {
    title: "Fix WordPress Stuck in Maintenance Mode | FixMyWP",
    description: "Site stuck on \"Briefly unavailable for scheduled maintenance\"? We clear it, finish the interrupted update and check nothing was left broken.",
  },
  image: { slot: "screen-maintenance-mode", alt: "A browser showing the WordPress message: Briefly unavailable for scheduled maintenance. Check back in a minute." },
});
