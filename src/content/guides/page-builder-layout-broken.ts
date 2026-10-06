import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "page-builder-layout-broken",
  title: "Elementor, Divi or WPBakery layout broken",
  h1: "Fix a broken Elementor, Divi or WPBakery layout",
  errorText: "The preview could not be loaded",
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
  safeChecks: [
    "Open the broken page in a private browser window. If it looks different there than in your normal window, caching is part of the problem.",
    "Go to Plugins in wp-admin and confirm the builder and any Pro or add-on plugin are active. Note the version numbers shown.",
  ],
  whenToCallUs:
    "If the builder and its Pro or add-on plugins are active and the layout is still broken, avoid rolling back, reinstalling or switching themes on the live site. Mismatched versions can make things worse, and some rollbacks are hard to undo cleanly. That is the point to have an engineer compare versions and errors on a backed up copy.",
  parentService: "elementor-issues",
  urgency: "high",
  faqs: [
    { q: "Have I lost my page designs?", a: "Almost always not. Divi and WPBakery store layouts as shortcodes in the page content, and Elementor stores them in the page's metadata. Once the builder runs correctly, the design renders again. WordPress revisions are also kept." },
    { q: "Why does my page show a wall of shortcodes?", a: "The builder that understands those shortcodes is not running. It may be deactivated, missing after a theme change or failing to load because of an error." },
    { q: "Should I roll back the Elementor update?", a: "Elementor has a rollback option under Elementor > Tools > Version Control, and it can be a useful short term step. Elementor Pro must be kept at a matching version, and rolling back leaves you on an older release, so we treat it as temporary." },
    { q: "Why is the layout only broken on mobile?", a: "Usually the responsive settings for that breakpoint, or a cache or optimization plugin serving a different CSS file to mobile visitors. Both can be checked without changing your design." },
  ],
  seo: {
    title: "Elementor, Divi or WPBakery Layout Broken",
    description: "Page builder layout broken after an update? We fix Elementor, Divi and WPBakery pages showing shortcodes, missing styles or editors that will not load.",
  },
  image: { slot: "illustration-page-builder-layout-broken", alt: "A web page with misaligned blocks and raw shortcode text where the designed layout should be" },
});
