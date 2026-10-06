import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "page-builder-layout-broken",
  category: "updates",
  title: "Elementor, Divi or WPBakery layout broken",
  h1: "Fix a broken Elementor, Divi or WPBakery layout",
  symptoms: [
    "The Elementor editor hangs on the loading screen or shows \"The preview could not be loaded\"",
    "Pages show raw shortcodes such as [vc_row][vc_column] from WPBakery or [et_pb_section] from Divi instead of the design",
    "Columns stack on top of each other, spacing and colors are gone or fonts have reverted after an update",
    "The Divi Visual Builder or WPBakery frontend editor will not open",
    "The page looks right when you are logged in but broken for visitors, or the other way round",
  ],
  likelyCauses: [
    "The builder plugin has been deactivated, its license has lapsed, or the theme was switched away from Divi, which carries its own builder",
    "Mismatched versions, such as Elementor updated without Elementor Pro, or a WPBakery copy bundled with an outdated theme",
    "Stale generated CSS from Elementor or Divi, or a caching or minification plugin combining builder files incorrectly",
    "A JavaScript error from another plugin stopping the editor or the page's scripts from running",
    "A PHP memory limit too low for the editor to load larger pages",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Check the browser console and PHP error log and compare the versions of the builder, its Pro or add-on plugins and the theme." },
    { verb: "Back up", detail: "Copy files and database first so page designs and revisions can always be restored." },
    { verb: "Repair", detail: "Bring builder and add-on versions back in step, regenerate the builder's CSS, exclude its files from minification and resolve any conflicting plugin." },
    { verb: "Verify", detail: "Check key pages logged in and logged out, on desktop and mobile, and open a page in the builder to confirm editing works." },
    { verb: "Harden", detail: "Set out a safe update order for the builder, its add-ons and the theme so the next update does not break layouts again." },
  ],
  safeChecks: [
    "Open the broken page in a private browser window. If it looks different there than in your normal window, caching is part of the problem.",
    "Go to Plugins in wp-admin and confirm the builder and any Pro or add-on plugin are active. Note the version numbers shown.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Have I lost my page designs?", a: "Almost always not. Divi and WPBakery store layouts as shortcodes in the page content, and Elementor stores them in the page's metadata. Once the builder runs correctly, the design renders again. WordPress revisions are also kept." },
    { q: "Why does my page show a wall of shortcodes?", a: "The builder that understands those shortcodes is not running. It may be deactivated, missing after a theme change or failing to load because of an error." },
    { q: "Should I roll back the Elementor update?", a: "Elementor has a rollback option under Elementor > Tools > Version Control, and it can be a useful short term step. Elementor Pro must be kept at a matching version, and rolling back leaves you on an older release, so we treat it as temporary." },
    { q: "Can I switch to a different page builder?", a: "You can, but layouts do not transfer between Elementor, Divi and WPBakery. Pages have to be rebuilt in the new builder, so it is a project rather than a quick fix." },
    { q: "Why is the layout only broken on mobile?", a: "Usually the responsive settings for that breakpoint, or a cache or optimization plugin serving a different CSS file to mobile visitors. Both can be checked without changing your design." },
  ],
  relatedSlugs: ["plugin-conflict", "theme-broken", "site-down-after-update", "memory-exhausted-error"],
  seo: {
    title: "Elementor, Divi or WPBakery Layout Broken | FixMyWP",
    description: "Page builder layout broken after an update? We fix Elementor, Divi and WPBakery pages showing shortcodes, missing styles or editors that will not load.",
  },
  image: { slot: "illustration-page-builder-layout-broken", alt: "A web page with misaligned blocks and raw shortcode text where the designed layout should be" },
});
