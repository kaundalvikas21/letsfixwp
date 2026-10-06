import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "plugin-conflict",
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
  safeChecks: [
    "Note which plugin was installed or updated last. The Plugins screen and Dashboard > Updates show recent version changes.",
    "If wp-admin will not load, rename the suspect plugin's folder in your host's file manager (for example add -off to the end). WordPress deactivates it, and renaming it back restores it.",
  ],
  whenToCallUs:
    "If you cannot tell which plugin is at fault, or the plugin involved is one the site depends on (WooCommerce, a page builder, a payment or membership plugin), stop switching things off on the live site. An engineer can test on a staging copy, find the exact clash and fix it without losing settings.",
  parentService: "plugin-theme-conflict",
  urgency: "high",
  faqs: [
    { q: "How do I know which plugin is causing the problem?", a: "The usual method is to disable plugins one at a time until the fault disappears. We do that on a staging copy or in a session only we can see, then confirm the culprit in the PHP and browser error logs." },
    { q: "Can I just delete the broken plugin?", a: "Deleting a plugin can also delete its settings and data, depending on how it was built. Deactivating it, or renaming its folder, is the safer first step while the real cause is found." },
    { q: "Will deactivating plugins break my site further?", a: "It can change how the site looks or works while they are off, which is why we test on staging or in a private troubleshooting session rather than on the live site." },
    { q: "The plugin developer says it is not their fault. Now what?", a: "Conflicts often sit between two plugins, so each developer points at the other. We find the exact line where they clash and fix it, or give each developer the evidence they need." },
  ],
  seo: {
    title: "Fix a Broken WordPress Plugin or Conflict",
    description: "Plugin broke your WordPress site or two plugins clash? We find the conflict, repair or replace the plugin and keep your settings and content safe.",
  },
  image: { slot: "illustration-plugin-conflict", alt: "Two WordPress plugin icons overlapping with a warning sign between them" },
});
