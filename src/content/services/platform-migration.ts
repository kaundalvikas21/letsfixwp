import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "platform-migration",
  path: "/wordpress-performance-migration/platform-migration/",
  hub: "wordpress-performance-migration",
  intent: "project",
  title: "Wix to WordPress migration",
  h1: "Move from Wix, Squarespace or Blogger to WordPress",
  summary:
    "We move your pages, posts, images and SEO settings from Wix, Squarespace or Blogger to a self-hosted WordPress site, with 301 redirects from every old URL.",
  whoItsFor:
    "Site owners who have outgrown Wix, Squarespace or Blogger and want full control of their site, hosting and content.",
  symptoms: [],
  whatWeDo: [
    { verb: "Audit", detail: "Crawl the current site to list every page, post, image and URL, plus titles and meta descriptions." },
    { verb: "Plan", detail: "Decide what can be exported, what must be moved by hand and how each old URL maps to its new one." },
    { verb: "Migrate", detail: "Bring content into WordPress using the Blogger and Squarespace exports where available, and move Wix content page by page." },
    { verb: "Build", detail: "Rebuild the design in a WordPress theme so the site looks right and is editable in the block editor." },
    { verb: "Launch", detail: "Set up 301 redirects, switch the domain, submit the new sitemap in Search Console and check for crawl errors." },
  ],
  deliverables: [
    "Your pages, posts and images on a WordPress site you control",
    "A URL map of every old address and its new one",
    "301 redirects from each old URL to the matching new page",
    "Titles, meta descriptions and image alt text carried over",
    "A new XML sitemap submitted in Google Search Console",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Will I lose my Google rankings?", a: "Rankings are best protected by 301 redirects mapped page to page, keeping titles and content, and submitting the new sitemap. Some movement after a platform change is normal while Google recrawls." },
    { q: "Can Wix content be exported automatically?", a: "Wix has no full export to WordPress. Blog posts can sometimes be pulled from the RSS feed, but pages and layouts are usually rebuilt by hand." },
    { q: "What about Squarespace and Blogger?", a: "Squarespace exports pages and blog posts in a WordPress-compatible file, though some blocks and products are left out. Blogger exports a full XML backup that WordPress can import." },
    { q: "Do I keep my domain name?", a: "Yes. If the domain was bought through Wix or Squarespace, you can point it at the new hosting or transfer it to a registrar of your choice." },
    { q: "Will the new site look the same?", a: "It can look the same, or we can use the move to update the design. Either way, you can edit it yourself in WordPress afterwards." },
  ],
  guideSlugs: [],
  relatedPaths: ["/compare/wordpress-vs-wix/", "/wordpress-development/redesign/", "/wordpress-development/seo-services/"],
  seo: {
    title: "Wix, Squarespace and Blogger to WordPress Migration",
    description: "Move from Wix, Squarespace or Blogger to WordPress with your content, images and SEO settings carried over and 301 redirects from every old URL.",
  },
  image: { slot: "service-platform-migration", alt: "Spreadsheet mapping old Wix page URLs to their new WordPress addresses" },
});
