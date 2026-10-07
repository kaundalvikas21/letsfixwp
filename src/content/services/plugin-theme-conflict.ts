import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "plugin-theme-conflict",
  path: "/wordpress-fix/plugin-theme-conflict/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress plugin conflict fix",
  h1: "Fix WordPress plugin and theme conflicts",
  heroLine: "Something broke after a plugin or theme change. We find the clashing pair and fix it, keeping your settings.",
  summary:
    "When two plugins, or a plugin and your theme, load clashing code, features stop working or the layout breaks. We find the exact pair that conflicts, fix or replace the code and keep your settings and design.",
  whoItsFor:
    "Owners whose forms, menus, sliders or layout broke after installing or updating a plugin or theme, and who cannot tell which one is responsible.",
  symptoms: [
    "A feature stopped working right after you installed or updated a plugin",
    "The layout, fonts or menu broke after a theme update",
    "Buttons, sliders or forms do nothing when clicked",
    "The site works with a default theme but breaks with yours",
    "Two plugins cannot be active at the same time without an error",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Reproduce the problem on a staging copy or in Health Check troubleshooting mode, which disables plugins for your session only, and read the browser console and PHP logs." },
    { verb: "Back up", detail: "Copy files and database so every plugin setting and theme customisation can be restored." },
    { verb: "Repair", detail: "Patch the conflicting code, roll back the update that caused it, move theme edits into a child theme or swap in a maintained alternative." },
    { verb: "Verify", detail: "Test the affected features, key pages and checkout with every plugin active." },
    { verb: "Report", detail: "Name the plugins or theme involved and tell you which updates to hold back until the developer fixes them." },
  ],
  deliverables: [
    "The conflict resolved with your plugins and theme working together",
    "Backups taken before the fix",
    "A written note naming the conflicting code and what we changed",
    "Theme edits moved into a child theme when they were made in the parent",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "How do you find which plugin is causing it?", a: "We switch plugins off one at a time on a staging copy or in troubleshooting mode, which your visitors do not see, and confirm the result in the error logs and browser console." },
    { q: "Can I deactivate all my plugins to test?", a: "On a live site that can break checkout, forms and logins for visitors while you test, and some plugins run clean up routines on deactivation. A staging copy or the Health Check plugin's troubleshooting mode is safer." },
    { q: "Why did a theme update undo my changes?", a: "Edits made directly to a parent theme's files are overwritten on every update. Keeping them in a child theme means updates no longer remove them." },
    { q: "Are nulled plugins the problem?", a: "Pirated copies of paid plugins often carry hidden code and never receive updates, which makes conflicts and hacks more likely. We recommend replacing them with licensed copies." },
  ],
  guideSlugs: ["plugin-conflict", "theme-broken"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/update-php-errors/", "/guides/plugin-conflict/", "/guides/theme-broken/"],
  seo: {
    title: "WordPress Plugin and Theme Conflict Fix",
    description: "Features or layout broke after a plugin or theme update? We find the conflicting code on a staging copy, fix it and keep your settings and design intact.",
  },
  image: { slot: "service-plugin-theme-conflict", alt: "The WordPress Plugins screen with two plugins highlighted next to a browser console error" },
});
