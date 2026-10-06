import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "stuck-in-maintenance-mode",
  title: "WordPress stuck in maintenance mode",
  h1: "Fix WordPress stuck in maintenance mode",
  errorText: "Briefly unavailable for scheduled maintenance. Check back in a minute.",
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
  safeChecks: [
    "In your host's file manager, turn on Show hidden files and look in the main WordPress folder for a file named .maintenance. Rename it to .maintenance-old rather than deleting it, then reload the site.",
    "Open the site in a private browser window. If the message is gone there, a cache is serving the old page, and clearing your caching plugin or host cache will fix it.",
  ],
  whenToCallUs:
    "If the message is still there after renaming .maintenance and clearing caches, or the site loads but parts of it are broken, the interrupted update left files half replaced. Reinstalling the right versions of core or plugins without touching your content needs file and log access. That is the point to hand it to an engineer.",
  parentService: "emergency",
  urgency: "critical",
  faqs: [
    { q: "Why is my site stuck on this message?", a: "WordPress creates a temporary .maintenance file while it updates and removes it when it finishes. If the update is interrupted, the file or a cached copy of the message can be left behind." },
    { q: "Is it safe to remove the .maintenance file?", a: "Clearing it is the standard fix, but the update that was running may not have completed. That can leave a plugin or core half updated, so the site should be checked afterwards." },
    { q: "The message is gone but the site is broken. Why?", a: "The interrupted update probably left a mix of old and new files. The plugin or core files need to be reinstalled cleanly to match one version." },
    { q: "How do I stop this happening again?", a: "Update plugins in smaller groups, keep the browser tab open until updates finish, and avoid updating during busy times on a server that is already slow." },
  ],
  seo: {
    title: "Fix WordPress Stuck in Maintenance Mode",
    description: "Site stuck on \"Briefly unavailable for scheduled maintenance\"? We clear it, finish the interrupted update and check nothing was left broken.",
  },
  image: { slot: "stuck-in-maintenance-mode", alt: "A browser showing the WordPress message: Briefly unavailable for scheduled maintenance. Check back in a minute." },
});
