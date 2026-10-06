import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "slow-wordpress-site",
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
  safeChecks: [
    "Run your home page through PageSpeed Insights at pagespeed.web.dev and keep the report link. It gives a before picture to compare against.",
    "Note whether wp-admin is slow as well as the public pages. A slow dashboard points to the server or database rather than images.",
  ],
  whenToCallUs:
    "If PageSpeed Insights points to slow server response, or wp-admin is slow as well, a caching plugin alone will not fix it. Database cleanup, swapping plugins and server caching can break carts, forms and logins when they are done without testing. That is the point to bring in an engineer who starts from a backup and a measured baseline.",
  parentService: "speed-optimization",
  urgency: "standard",
  faqs: [
    { q: "Will a caching plugin fix it?", a: "It helps public pages a lot, but it does nothing for logged-in users, the cart or checkout, and it hides rather than fixes slow queries. We find the underlying cause and then add caching on top." },
    { q: "Do I need to change hosting?", a: "Sometimes, but not by default. Many slow sites are slow because of plugins, images or the database. We measure first and only recommend a move if the server is the real limit." },
    { q: "Can speed work break my site?", a: "Aggressive minification and script deferral can break menus, sliders and checkout. That is why we back up first, change one thing at a time and test the pages that matter." },
    { q: "Why is the site slower when I am logged in?", a: "Logged-in users usually bypass the page cache, so every page is built fresh. Admin toolbars and editor scripts add more on top. Visitors often see a faster site than you do." },
  ],
  seo: {
    title: "WordPress Site Slow? We Find the Cause",
    description: "Slow WordPress site? We measure where the time goes, fix caching, images, plugins and database bloat, then re-test so you can see what changed.",
  },
  image: { slot: "illustration-slow-wordpress-site", alt: "A browser window with a loading spinner and a progress bar barely moving" },
});
