import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "speed-optimization",
  path: "/wordpress-performance-migration/speed-optimization/",
  hub: "wordpress-performance-migration",
  intent: "project",
  title: "WordPress speed optimization",
  h1: "WordPress speed optimization based on measurement, not guesswork",
  heroLine: "Slow pages or failing Core Web Vitals. We measure what slows them, fix it and re-test the same pages.",
  summary:
    "We measure where your WordPress site loses time, fix the causes in caching, images, plugins, database and hosting, and re-test the same pages so you can see what changed.",
  whoItsFor:
    "Owners of slow WordPress or WooCommerce sites, and sites failing Core Web Vitals in Google Search Console.",
  symptoms: [],
  whatWeDo: [
    { verb: "Measure", detail: "Record a baseline with PageSpeed Insights, Search Console field data, server response times and Query Monitor." },
    { verb: "Back up", detail: "Take a full copy of files and database before changing any setting or plugin." },
    { verb: "Optimize", detail: "Set up page and object caching, resize and compress images, cut heavy plugin scripts and clean the database." },
    { verb: "Test", detail: "Re-measure the same pages and check carts, forms and logged-in areas are not being cached by mistake." },
    { verb: "Report", detail: "Explain what changed, what your hosting still limits and what to watch as the site grows." },
  ],
  deliverables: [
    "Before and after PageSpeed Insights reports for the same pages",
    "Caching set up and configured for your host and plugins",
    "Optimized images and a cleaned, smaller database",
    "A written list of every change made and why",
    "Advice on hosting if the server turns out to be the limit",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "What are the Core Web Vitals targets?", a: "Google treats a page as good when Largest Contentful Paint is 2.5 seconds or less, Interaction to Next Paint is 200 milliseconds or less and Cumulative Layout Shift is 0.1 or less, measured at the 75th percentile of real visits." },
    { q: "Why does Search Console still show failing after the fix?", a: "Search Console uses real visitor data collected over the previous 28 days, so it updates gradually. PageSpeed Insights lab results show the improvement straight away." },
    { q: "Will a caching plugin alone fix it?", a: "It helps public pages, but does nothing for logged-in users, cart or checkout, and it hides slow queries rather than fixing them. We find the cause first, then add caching." },
    { q: "Do I need to change hosting?", a: "Not by default. Many slow sites are slow because of plugins, images or the database. We only recommend a move if measurements show the server is the real limit." },
    { q: "Can speed work break my site?", a: "Aggressive minification and script deferral can break menus, sliders and checkout. That is why we back up, change one thing at a time and test the pages that matter." },
  ],
  guideSlugs: ["slow-wordpress-site", "core-web-vitals-failing", "high-server-load"],
  relatedPaths: [
    "/guides/slow-wordpress-site/",
    "/guides/core-web-vitals-failing/",
    "/wordpress-performance-migration/hosting-migration/",
    "/free-site-check/",
  ],
  seo: {
    title: "WordPress Speed Optimization and Core Web Vitals Fixes",
    description: "We measure your WordPress site, fix caching, images, plugins and database bloat, and re-test against Core Web Vitals so you can see what changed.",
  },
  image: { slot: "service-speed-optimization", alt: "PageSpeed Insights report showing LCP, INP and CLS results for a WordPress page" },
});
