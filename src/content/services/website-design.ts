import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "website-design",
  path: "/wordpress-development/website-design/",
  hub: "wordpress-development",
  intent: "project",
  title: "WordPress website design",
  h1: "WordPress website design for businesses",
  heroLine: "A WordPress site planned around your business, quick on phones, ready for search and easy for you to edit.",
  summary:
    "We plan, design and build a WordPress website that you can edit yourself, loads quickly on phones and is set up for search from launch.",
  whoItsFor:
    "Businesses that need a new website, or a first proper website, built on WordPress.",
  symptoms: [],
  whatWeDo: [
    { verb: "Plan", detail: "Agree the pages, content, features and the actions you want visitors to take before any design starts." },
    { verb: "Design", detail: "Design the key page layouts for mobile and desktop and revise them with you." },
    { verb: "Build", detail: "Build the site with the block editor or a lightweight theme so you can edit text and images without code." },
    { verb: "Test", detail: "Check pages, forms and speed on real phones and browsers, and fix accessibility basics such as contrast and headings." },
    { verb: "Launch", detail: "Connect your domain, install SSL, submit the sitemap to Google and show you how to edit the site." },
  ],
  deliverables: [
    "A responsive WordPress website on your domain and hosting",
    "Page designs approved by you before build",
    "Contact forms, analytics and Search Console set up",
    "Basic on-page SEO: titles, descriptions, headings and XML sitemap",
    "A walkthrough recording on how to edit your pages",
    "Admin access and ownership of everything we build",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Will I be able to edit the site myself?", a: "Yes. We build with the WordPress block editor or a builder you are comfortable with, and show you how to change text, images and pages." },
    { q: "Do you write the content?", a: "We can structure pages and write headings and calls to action. Most clients supply the details about their business, and we shape it into pages." },
    { q: "Who owns the site?", a: "You do. The domain, hosting, files and admin accounts are in your name, and nothing is locked to us." },
    { q: "Do you provide hosting?", a: "We can recommend hosting that suits your traffic and budget, or build on hosting you already have." },
    { q: "How much does a WordPress website cost?", a: "It depends on the number of pages, features and how much content we create. We send a quote after a short call about what you need." },
  ],
  guideSlugs: [],
  relatedPaths: ["/wordpress-development/custom-theme/", "/wordpress-development/seo-services/", "/wordpress-maintenance/care-plans/"],
  seo: {
    title: "WordPress Website Design for Businesses",
    description: "We plan, design and build WordPress websites you can edit yourself, fast on phones and ready for search, on hosting and a domain you own.",
  },
  image: { slot: "service-website-design", alt: "Desktop and mobile mockups of a business website open side by side on a designer's screen" },
});
