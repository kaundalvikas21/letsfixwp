import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "redesign",
  path: "/wordpress-development/redesign/",
  hub: "wordpress-development",
  intent: "project",
  title: "WordPress website redesign",
  h1: "Redesign your WordPress website without losing traffic",
  heroLine: "Your site looks dated or is hard to edit. We redesign it and keep the URLs that earn search traffic.",
  summary:
    "We redesign your existing WordPress site with a new look and structure, while keeping your content, URLs and search rankings protected through the change.",
  whoItsFor:
    "Businesses whose WordPress site looks dated, is hard to edit, or no longer works well on phones.",
  symptoms: [],
  whatWeDo: [
    { verb: "Audit", detail: "Review the current site, its traffic from Search Console and analytics, and the pages that bring in leads or sales." },
    { verb: "Plan", detail: "Agree the new structure and map every existing URL to its place in the new site." },
    { verb: "Design", detail: "Design the new layouts for mobile and desktop and revise them with you." },
    { verb: "Build", detail: "Build the redesign on a staging copy so the live site keeps running until launch." },
    { verb: "Launch", detail: "Go live with 301 redirects for any changed URLs, then check Search Console for crawl errors." },
  ],
  deliverables: [
    "A redesigned WordPress site built on staging and approved by you",
    "A URL map and 301 redirects for every changed address",
    "Existing content, titles and meta descriptions carried across",
    "Before and after speed reports for key pages",
    "A walkthrough on editing the new site",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Will a redesign hurt my rankings?", a: "It can if URLs change without redirects or important content is removed. We map every old URL, keep or improve the content on pages that rank and add 301 redirects where addresses change." },
    { q: "Does my site stay live during the redesign?", a: "Yes. We build on a staging copy, and the live site keeps running until you approve the new one." },
    { q: "Can you keep my existing content?", a: "Yes. Posts, pages, products and media stay in WordPress. We restyle and restructure them rather than starting from empty." },
    { q: "Should I redesign or rebuild from scratch?", a: "If the content and plugins are sound, a redesign is usually enough. If the theme is the root of slowness or editing problems, we may suggest a new theme as part of the work." },
  ],
  guideSlugs: [],
  relatedPaths: ["/wordpress-development/website-design/", "/wordpress-development/seo-services/", "/wordpress-performance-migration/speed-optimization/"],
  seo: {
    title: "WordPress Website Redesign Without Losing Traffic",
    description: "Redesign your WordPress site on staging with your content kept, every changed URL redirected and Search Console checked after launch.",
  },
  image: { slot: "service-redesign", alt: "Old and new versions of a WordPress home page shown side by side" },
});
