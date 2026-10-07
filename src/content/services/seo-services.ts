import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "seo-services",
  path: "/wordpress-development/seo-services/",
  hub: "wordpress-development",
  intent: "project",
  title: "WordPress SEO services",
  h1: "Technical and on-page SEO for WordPress sites",
  heroLine: "Pages missing from Google or slipping down? We fix crawl and index problems and set up each page's on-page SEO.",
  summary:
    "We fix the technical problems that stop WordPress pages being crawled, indexed and ranked, and set up on-page SEO so each page targets the searches it should.",
  whoItsFor:
    "WordPress site owners whose pages are not indexed, have dropped in Google or were never set up properly for search.",
  symptoms: [],
  whatWeDo: [
    { verb: "Audit", detail: "Crawl the site and review Search Console for indexing errors, duplicate pages, broken links and redirect chains." },
    { verb: "Fix", detail: "Correct canonical tags, noindex settings, robots.txt, XML sitemaps and 301 redirects." },
    { verb: "Optimize", detail: "Improve titles, meta descriptions, headings, internal links and image alt text on the pages that matter." },
    { verb: "Mark up", detail: "Add structured data such as Organization, Article, Product, FAQ and Breadcrumb where it fits the content." },
    { verb: "Measure", detail: "Track indexing, impressions and clicks in Search Console and report what changed." },
  ],
  deliverables: [
    "A technical SEO audit with each issue and its fix",
    "Fixed indexing, sitemap, canonical and redirect settings",
    "Updated titles, descriptions and headings on agreed pages",
    "Structured data validated in Google's Rich Results Test",
    "A Search Console report comparing before and after",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Can you get me to the first page of Google?", a: "No honest provider can promise rankings, because Google decides them. We fix what stops your pages from being found and make each page a clearer match for the searches you want." },
    { q: "Which SEO plugin do you use?", a: "We work with the one you have, usually Yoast SEO, Rank Math or SEOPress. Switching plugins is rarely needed." },
    { q: "Do you build backlinks?", a: "No. We focus on technical and on-page SEO on your WordPress site. Bought links break Google's spam policies and can lead to penalties." },
    { q: "Why are my pages not indexed?", a: "Common causes are a noindex setting left on from development, a blocking robots.txt, wrong canonical tags or thin duplicate pages. Search Console's page indexing report shows which one applies." },
    { q: "Does site speed affect SEO?", a: "Core Web Vitals are part of Google's page experience signals. They matter less than relevant content, but a slow site also loses visitors before they read anything." },
  ],
  guideSlugs: [],
  relatedPaths: [
    "/wordpress-performance-migration/speed-optimization/",
    "/wordpress-security/seo-spam-cleanup/",
    "/wordpress-development/redesign/",
  ],
  seo: {
    title: "WordPress SEO Services: Technical and On-Page",
    description: "Technical and on-page SEO for WordPress: indexing fixes, sitemaps, canonicals, redirects, structured data and page titles, measured in Search Console.",
  },
  image: { slot: "service-seo-services", photo: "night-desk", alt: "Google Search Console page indexing report for a WordPress site" },
});
