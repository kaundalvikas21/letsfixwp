import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "elementor-issues",
  path: "/wordpress-fix/elementor-issues/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "Elementor not working fix",
  h1: "Fix Elementor and page builder problems",
  summary:
    "Page builders break when versions fall out of step, generated CSS goes stale, or caching and optimisation plugins interfere. We fix Elementor and other builders so the editor loads and your pages look the way you designed them.",
  whoItsFor:
    "Owners whose Elementor editor will not load, or whose builder pages look broken or unstyled on the live site.",
  symptoms: [
    "The Elementor editor stays on the loading screen",
    "Pages look unstyled or the layout is broken on the live site",
    "\"The preview could not be loaded\" in the editor",
    "Changes saved in the editor do not show on the live page",
    "Widgets or sections disappeared after updating Elementor or Elementor Pro",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Check the browser console, PHP error log, memory limit and the Elementor and Elementor Pro versions for the point of failure." },
    { verb: "Back up", detail: "Copy files and database, including the stored page layouts, before changing anything." },
    { verb: "Repair", detail: "Match builder versions, regenerate Elementor's CSS files, fix caching and minification settings, and resolve plugin conflicts in the editor." },
    { verb: "Verify", detail: "Open the editor, save test changes and check affected pages on desktop and mobile." },
    { verb: "Report", detail: "Tell you what broke the builder and which settings to keep when you update next." },
  ],
  deliverables: [
    "The page builder editor loading and saving again",
    "Your pages displaying the saved design on the live site",
    "Backups taken before the fix",
    "A written note of the cause and safe update settings",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why does my layout look broken after an update?", a: "Elementor writes CSS files for each page. After an update those files can be out of date, or a caching or minification plugin can keep serving old copies. Regenerating the files and purging caches usually fixes it." },
    { q: "Why will the editor not load?", a: "Common causes are a low PHP memory limit, a plugin that loads conflicting scripts in the editor, a server security rule blocking editor requests, or Elementor and Elementor Pro on mismatched versions." },
    { q: "Will fixing it lose my designs?", a: "No. Elementor stores each page's layout in the database, and we back up before changing anything. Page revisions also let you return to an earlier saved version." },
    { q: "Do you fix other page builders?", a: "Yes. We also work on Divi, WPBakery, Beaver Builder and the block editor." },
  ],
  guideSlugs: ["page-builder-layout-broken"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/plugin-theme-conflict/", "/guides/page-builder-layout-broken/"],
  seo: {
    title: "Elementor Not Working? Page Builder Fix",
    description: "Elementor editor stuck loading or pages broken on the live site? We fix version mismatches, stale CSS and caching conflicts without losing your designs.",
  },
  image: { slot: "service-elementor-issues", alt: "The Elementor editor stuck on its loading screen inside wp-admin" },
});
