import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "core-web-vitals-failing",
  category: "performance",
  title: "WordPress Core Web Vitals failing",
  h1: "Fix failing Core Web Vitals on WordPress",
  symptoms: [
    "The Core Web Vitals report in Search Console lists URLs as \"Poor\" or \"Need improvement\"",
    "Search Console shows issues such as \"LCP issue: longer than 2.5s (mobile)\", \"INP issue: longer than 200ms\" or \"CLS issue: more than 0.1\"",
    "PageSpeed Insights shows \"Core Web Vitals Assessment: Failed\" for your pages",
    "Text and buttons jump around while the page loads, or taps and clicks take a moment to respond",
  ],
  likelyCauses: [
    "A large hero image or slider that is lazy loaded or not prioritized, delaying Largest Contentful Paint",
    "Render-blocking CSS and JavaScript from the theme, page builder and plugins",
    "Images, ads, embeds and web fonts loading without reserved space, causing layout shift",
    "Heavy third party scripts such as chat widgets, tag managers and animation libraries tying up the browser and hurting INP",
    "Slow server response from the host or no page caching",
  ],
  ourFix: [
    { verb: "Measure", detail: "Read the field data from Search Console and PageSpeed Insights, then run lab traces to find the LCP element, the shifting elements and the long tasks." },
    { verb: "Back up", detail: "Copy files and database before changing theme, builder or plugin settings." },
    { verb: "Optimize", detail: "Prioritize the main image, defer non-critical scripts, reserve space for images and embeds, tame third party scripts and add caching." },
    { verb: "Verify", detail: "Check the lab results on the same pages, test that menus, forms and checkout still work and start validation in Search Console." },
    { verb: "Harden", detail: "Explain which plugins or design choices caused the failures so new pages do not reintroduce them." },
  ],
  safeChecks: [
    "In Search Console, open Core Web Vitals and note whether the problem is on mobile, desktop or both, and which metric is failing.",
    "Run one affected page through PageSpeed Insights and save the link. The top section shows real visitor data, which is what Google assesses.",
  ],
  urgency: "standard",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "What does passing mean?", a: "Google's published thresholds are LCP of 2.5 seconds or less, INP of 200 milliseconds or less and CLS of 0.1 or less, measured at the 75th percentile of real visits." },
    { q: "My Lighthouse score is good, so why am I failing?", a: "Lighthouse is a lab test on one simulated device. Core Web Vitals in Search Console use real visitor data from the Chrome UX Report, which includes slower phones and networks." },
    { q: "How soon will Search Console show the fix?", a: "Field data covers a rolling 28 day window of real visits, so results change gradually. When you click Validate Fix, Search Console monitors the pages over a similar period before marking them passed." },
    { q: "Will passing Core Web Vitals improve my rankings?", a: "They are one of Google's page experience signals, but relevance and content quality matter more. Fixing them mainly helps visitors, who get a faster and steadier page." },
    { q: "Do I have to drop my page builder?", a: "Usually not. Most failures come from specific settings, images and scripts that can be fixed while keeping your builder and design." },
  ],
  relatedSlugs: ["slow-wordpress-site", "high-server-load", "page-builder-layout-broken"],
  seo: {
    title: "WordPress Core Web Vitals Failing? | FixMyWP",
    description: "LCP, INP or CLS failing in Search Console? We find the elements and scripts behind it on your WordPress site and fix them without a redesign.",
  },
  image: { slot: "illustration-core-web-vitals-failing", alt: "A Search Console style report with LCP, INP and CLS gauges showing poor results" },
});
