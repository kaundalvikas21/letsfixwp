import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "theme-broken",
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
  safeChecks: [
    "Open the site in a private window and on your phone. If it looks fine there, the problem may only be your browser's cached files.",
    "Go to Appearance > Themes and note the active theme's version number and any \"Broken Themes\" notice at the bottom.",
    "If you use a caching plugin or a CDN, clear its cache and reload the page. Old CSS or JavaScript files being served is a common cause of a broken layout.",
  ],
  whenToCallUs:
    "If the layout is still broken in a private window after clearing caches, or your custom changes were lost in an update, stop there. Switching themes or reinstalling over the top can remove widgets, menus and settings. An engineer can repair the templates and move your changes into a child theme.",
  parentService: "plugin-theme-conflict",
  urgency: "high",
  faqs: [
    { q: "Why did my changes disappear after a theme update?", a: "Updates replace the theme's files completely. Any edits made directly inside the parent theme are overwritten. A child theme keeps your changes separate so updates leave them alone." },
    { q: "Can I switch to a different theme to fix it?", a: "Switching themes changes menus, widgets and layout settings, and page content built with theme shortcodes may break. It is better to repair the current theme first and plan any switch separately." },
    { q: "My theme is no longer supported. Is it safe to keep?", a: "An abandoned theme stops getting security and compatibility fixes, so it tends to break on WordPress or PHP updates. We can patch it to keep you running and tell you honestly when replacing it makes more sense." },
    { q: "Will fixing the theme change my content?", a: "No. Posts, pages and media live in the database. Theme repairs change how that content is displayed, not the content itself." },
  ],
  seo: {
    title: "Fix a Broken WordPress Theme",
    description: "Theme layout broken, styles missing or changes lost after an update? We repair your WordPress theme and move custom edits into a safe child theme.",
  },
  image: { slot: "illustration-theme-broken", alt: "A website layout with misaligned columns and a missing header" },
});
