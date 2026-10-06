import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "php-upgrade-broke-site",
  category: "updates",
  title: "WordPress site broken after PHP upgrade",
  h1: "Fix a WordPress site broken by a PHP upgrade",
  symptoms: [
    "\"There has been a critical error on this website\" appears right after the host moved the site to a newer PHP version",
    "The error log shows lines like \"PHP Fatal error: Uncaught Error: Call to undefined function create_function()\"",
    "A TypeError such as \"count(): Argument #1 ($value) must be of type Countable|array, null given\" stops a page from loading",
    "Lines starting with \"Deprecated:\" or \"Warning:\" are printed across the top of pages or wp-admin",
    "Most of the site works, but one plugin's settings page, shortcode or form is suddenly broken",
  ],
  likelyCauses: [
    "A plugin or theme that still calls functions removed in PHP 8, such as create_function() or each()",
    "Stricter type checks in PHP 8 turning what used to be harmless warnings into fatal errors",
    "An abandoned plugin or an old premium theme that no longer receives compatibility updates",
    "A PHP extension the site relies on, such as mysqli, intl or imagick, not enabled for the new version",
    "A WordPress core version too old to support the PHP version the server now runs",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Read the PHP error log and list every plugin, theme file and custom snippet that fails on the new PHP version." },
    { verb: "Back up", detail: "Take a full copy of files and database first, so every change can be rolled back." },
    { verb: "Repair", detail: "Update components that have compatible releases, patch or replace abandoned code and enable any missing PHP extensions. If the site must be online immediately, we can switch it back to the previous PHP version while the fix is made, where your host allows it." },
    { verb: "Verify", detail: "Test the home page, key pages, wp-admin, forms and checkout on the new PHP version with error logging on." },
    { verb: "Harden", detail: "Give you a list of plugins and themes that are unmaintained or close to breaking, so the next PHP upgrade does not catch you out." },
  ],
  safeChecks: [
    "In your hosting control panel, check which PHP version the site runs now and when it changed. Many hosts send an email before an automatic upgrade.",
    "If wp-admin loads, open Tools > Site Health. It shows the PHP version in use and any critical issues WordPress has detected.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Can I just switch back to the old PHP version?", a: "Often yes, as a short term measure, if your host still offers it. Older PHP versions stop receiving security fixes, though, and hosts remove them eventually. The lasting fix is making the site run on a supported version." },
    { q: "Why did my host upgrade PHP without asking me?", a: "Each PHP version has a published end of life date, after which it gets no security patches. Hosts retire those versions across their servers, usually with an email notice that is easy to miss." },
    { q: "Will updating all my plugins fix it?", a: "It fixes many cases, but not all. Abandoned plugins have no update to install, and bulk updating everything on a broken site can add new problems. We update in a controlled order and test as we go." },
    { q: "Is my content safe?", a: "Yes. A PHP compatibility error is a code problem. Your posts, pages, orders and media stay in the database untouched." },
    { q: "Do I need a new theme?", a: "Not always. Small compatibility problems can be fixed in a child theme or with a vendor update. If the theme is abandoned and heavily broken, we explain the options before changing anything." },
  ],
  relatedSlugs: ["critical-error-on-this-website", "php-fatal-error", "plugin-conflict", "theme-broken"],
  seo: {
    title: "WordPress Broken After PHP Upgrade | FixMyWP",
    description: "Site broke after your host upgraded PHP? We find the incompatible plugin or theme code, repair it and get WordPress running on a supported PHP version.",
  },
  image: { slot: "illustration-php-upgrade-broke-site", alt: "A WordPress error screen next to a server panel showing the PHP version being changed" },
});
