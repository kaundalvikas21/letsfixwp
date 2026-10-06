import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "plugin-conflict",
  legacySlug: "fix-wordpress-plugin",
  category: "errors",
  title: "WordPress plugin conflict",
  h1: "Fix a broken WordPress plugin or plugin conflict",
  symptoms: [
    "The site or wp-admin broke right after you installed, updated or activated a plugin",
    "Sliders, menus, popups or forms stop working, and the browser console shows \"Uncaught TypeError: $ is not a function\" or \"jQuery is not defined\"",
    "The block editor shows \"The editor has encountered an unexpected error.\"",
    "A plugin's settings page loads blank, or saving its settings does nothing",
    "Two features that used to work together, such as a cache plugin and a form plugin, now break each other",
  ],
  likelyCauses: [
    "Two plugins loading different versions of the same JavaScript library, or one plugin breaking another's scripts",
    "A plugin update that is not compatible with your WordPress or PHP version",
    "Two plugins declaring the same PHP function or class, which triggers \"Cannot redeclare\" fatal errors",
    "A caching or minify plugin combining JavaScript files in the wrong order",
    "An abandoned plugin that has not been updated for current WordPress",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Run a conflict test on a staging copy or in a troubleshooting session that only affects our login, so visitors never see plugins switching on and off." },
    { verb: "Back up", detail: "Take a full copy of files and database first, so any plugin change can be rolled back." },
    { verb: "Repair", detail: "Patch, roll back or replace the faulty plugin, or adjust script loading and cache settings so both plugins work side by side." },
    { verb: "Verify", detail: "Test the features that broke, plus forms, checkout and the editor, on desktop and mobile." },
    { verb: "Harden", detail: "Tell you which plugin caused it and which updates to hold back until the developer ships a fix." },
  ],
  safeChecks: [
    "Note which plugin was installed or updated last. The Plugins screen and Dashboard > Updates show recent version changes.",
    "If wp-admin will not load, rename the suspect plugin's folder in your host's file manager (for example add -off to the end). WordPress deactivates it, and renaming it back restores it.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "How do I know which plugin is causing the problem?", a: "The usual method is to disable plugins one at a time until the fault disappears. We do that on a staging copy or in a session only we can see, then confirm the culprit in the PHP and browser error logs." },
    { q: "Can I just delete the broken plugin?", a: "Deleting a plugin can also delete its settings and data, depending on how it was built. Deactivating it, or renaming its folder, is the safer first step while the real cause is found." },
    { q: "Will deactivating plugins break my site further?", a: "It can change how the site looks or works while they are off, which is why we test on staging or in a private troubleshooting session rather than on the live site." },
    { q: "The plugin developer says it is not their fault. Now what?", a: "Conflicts often sit between two plugins, so each developer points at the other. We find the exact line where they clash and fix it, or give each developer the evidence they need." },
    { q: "Do you fix custom or premium plugins too?", a: "Yes. We work with free, premium and custom plugins. For premium plugins we may need your licence so we can install the vendor's latest version." },
  ],
  relatedSlugs: ["theme-broken", "site-down-after-update", "php-fatal-error", "white-screen-of-death"],
  seo: {
    title: "Fix a Broken WordPress Plugin or Conflict | FixMyWP",
    description: "Plugin broke your WordPress site or two plugins clash? We find the conflict, repair or replace the plugin and keep your settings and content safe.",
  },
  image: { slot: "illustration-plugin-conflict", alt: "Two WordPress plugin icons overlapping with a warning sign between them" },
});
