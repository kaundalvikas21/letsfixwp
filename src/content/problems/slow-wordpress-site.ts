import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "slow-wordpress-site",
  category: "performance",
  title: "WordPress site slow",
  h1: "Fix a slow WordPress site",
  symptoms: [
    "Pages sit on a blank screen for a noticeable time before anything appears",
    "wp-admin is sluggish and saving a post or product takes a long time",
    "PageSpeed Insights reports slow server response time (TTFB) and large images",
    "The site gets slower at busy times or has slowed down steadily as content and orders have grown",
  ],
  likelyCauses: [
    "No page caching, so PHP and the database rebuild every page for every visitor",
    "Heavy plugins loading their scripts, styles and database queries on every page",
    "Large, uncompressed images served at full size to phones and desktops alike",
    "A bloated database with oversized autoloaded options, expired transients and thousands of revisions",
    "Underpowered or overcrowded hosting, or an old PHP version",
  ],
  ourFix: [
    { verb: "Measure", detail: "Record a baseline with PageSpeed Insights, server response times and Query Monitor to see exactly where the time goes." },
    { verb: "Back up", detail: "Take a full copy of files and database before changing any settings or plugins." },
    { verb: "Optimize", detail: "Set up page and object caching where your host supports it, compress and resize images, replace or reconfigure heavy plugins and clean up the database." },
    { verb: "Verify", detail: "Re-measure the same pages and confirm carts, forms and logged-in areas are not being cached by mistake." },
    { verb: "Harden", detail: "Report what changed, what limits your hosting still imposes and what to watch for as the site grows." },
  ],
  safeChecks: [
    "Run your home page through PageSpeed Insights at pagespeed.web.dev and keep the report link. It gives a before picture to compare against.",
    "Note whether wp-admin is slow as well as the public pages. A slow dashboard points to the server or database rather than images.",
  ],
  urgency: "standard",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Will a caching plugin fix it?", a: "It helps public pages a lot, but it does nothing for logged-in users, the cart or checkout, and it hides rather than fixes slow queries. We find the underlying cause and then add caching on top." },
    { q: "Do I need to change hosting?", a: "Sometimes, but not by default. Many slow sites are slow because of plugins, images or the database. We measure first and only recommend a move if the server is the real limit." },
    { q: "Can speed work break my site?", a: "Aggressive minification and script deferral can break menus, sliders and checkout. That is why we back up first, change one thing at a time and test the pages that matter." },
    { q: "Why is the site slower when I am logged in?", a: "Logged-in users usually bypass the page cache, so every page is built fresh. Admin toolbars and editor scripts add more on top. Visitors often see a faster site than you do." },
    { q: "How many plugins is too many?", a: "There is no magic number. One poorly built plugin can slow a site more than twenty light ones. We look at what each plugin actually costs in load time." },
  ],
  relatedSlugs: ["core-web-vitals-failing", "high-server-load", "plugin-conflict", "memory-exhausted-error"],
  seo: {
    title: "WordPress Site Slow? We Find the Cause | FixMyWP",
    description: "Slow WordPress site? We measure where the time goes, fix caching, images, plugins and database bloat, then re-test so you can see what changed.",
  },
  image: { slot: "illustration-slow-wordpress-site", alt: "A browser window with a loading spinner and a progress bar barely moving" },
});
