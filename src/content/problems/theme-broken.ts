import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "theme-broken",
  legacySlug: "fix-wordpress-theme",
  category: "errors",
  title: "WordPress theme broken",
  h1: "Fix a broken WordPress theme",
  symptoms: [
    "The layout is broken: sidebars drop below the content, columns stack or the header and footer are missing",
    "Pages load as plain unstyled text because the theme stylesheet is not loading",
    "Custom changes to the design disappeared after a theme update",
    "Appearance > Themes shows \"Broken Themes\" or \"Stylesheet is missing.\"",
    "Menus, the mobile menu toggle or theme options panels no longer work",
  ],
  likelyCauses: [
    "A theme update overwrote edits made directly to the parent theme instead of a child theme",
    "An outdated theme that no longer works with the current WordPress, PHP or WooCommerce version",
    "Outdated template overrides in a child theme, such as old WooCommerce template files",
    "A caching, minify or CDN setting serving old or broken CSS and JavaScript",
    "An incomplete theme upload or a missing style.css file",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Compare the broken pages against the theme's files, logs and browser console to find whether the fault is CSS, JavaScript, PHP templates or caching." },
    { verb: "Back up", detail: "Copy the whole site, including the current theme folder, before changing a single file." },
    { verb: "Repair", detail: "Fix the failing templates or styles and move your custom changes into a child theme so the next update cannot wipe them." },
    { verb: "Verify", detail: "Check key pages on desktop and mobile, including menus, forms and shop pages, against how they looked before." },
    { verb: "Harden", detail: "Tell you whether the theme is still maintained and what to watch for before the next theme update." },
  ],
  safeChecks: [
    "Open the site in a private window and on your phone. If it looks fine there, the problem may only be your browser's cached files.",
    "Go to Appearance > Themes and note the active theme's version number and any \"Broken Themes\" notice at the bottom.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why did my changes disappear after a theme update?", a: "Updates replace the theme's files completely. Any edits made directly inside the parent theme are overwritten. A child theme keeps your changes separate so updates leave them alone." },
    { q: "Can I switch to a different theme to fix it?", a: "Switching themes changes menus, widgets and layout settings, and page content built with theme shortcodes may break. It is better to repair the current theme first and plan any switch separately." },
    { q: "My theme is no longer supported. Is it safe to keep?", a: "An abandoned theme stops getting security and compatibility fixes, so it tends to break on WordPress or PHP updates. We can patch it to keep you running and tell you honestly when replacing it makes more sense." },
    { q: "Will fixing the theme change my content?", a: "No. Posts, pages and media live in the database. Theme repairs change how that content is displayed, not the content itself." },
    { q: "Do you work with page builder themes?", a: "Yes, including themes built around Elementor, Divi, WPBakery and the block editor. If the builder itself is causing the break, we repair that too." },
  ],
  relatedSlugs: ["plugin-conflict", "page-builder-layout-broken", "site-down-after-update", "php-upgrade-broke-site"],
  seo: {
    title: "Fix a Broken WordPress Theme | FixMyWP",
    description: "Theme layout broken, styles missing or changes lost after an update? We repair your WordPress theme and move custom edits into a safe child theme.",
  },
  image: { slot: "illustration-theme-broken", alt: "A website layout with misaligned columns and a missing header" },
});
