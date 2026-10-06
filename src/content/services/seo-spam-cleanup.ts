import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "seo-spam-cleanup",
  path: "/wordpress-security/seo-spam-cleanup/",
  hub: "wordpress-security",
  intent: "fix",
  title: "WordPress SEO spam cleanup",
  h1: "Clean SEO spam and the Japanese keyword hack from WordPress",
  summary:
    "SEO spam hacks create pages full of Japanese text, pharmacy or casino links on your domain, usually hidden from you and shown only to search engines. We remove the generator code and spam pages, take back Search Console and help Google drop the spam from its index.",
  whoItsFor:
    "Owners who see foreign language or spam titles in Google results for their domain, or unknown owners and sitemaps in Search Console.",
  symptoms: [
    "Google results for your domain show Japanese titles or spam you never wrote",
    "A site: search for your domain lists pages that do not exist in wp-admin",
    "Search Console has owners or sitemaps you did not add",
    "Your home page title or description in Google has been replaced",
    "Spam links appear in the page source but not on screen",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Find the script that generates spam pages, any cloaking code that shows them only to Googlebot, and rogue Search Console owners." },
    { verb: "Back up", detail: "Snapshot files and database before cleaning." },
    { verb: "Clean", detail: "Remove generator scripts, injected .htaccess rules, spam sitemaps and spam entries in the database." },
    { verb: "Recover", detail: "Make spam URLs return 404 or 410, remove rogue owners and their verification files, and submit a clean sitemap so Google recrawls." },
    { verb: "Harden", detail: "Close the entry point, reset passwords and security keys, and update or remove vulnerable plugins." },
  ],
  deliverables: [
    "Spam pages and the code that generated them removed",
    "Rogue Search Console owners and sitemaps removed",
    "Spam URLs returning 404 or 410 and a clean sitemap submitted",
    "Backups taken before and after the cleanup",
    "A written record of what was found and changed",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why can I not see the spam pages on my site?", a: "The hack checks who is asking. It serves spam to Googlebot or to visitors arriving from search, and your normal pages to everyone else. Search Console's URL Inspection shows the page as Google sees it." },
    { q: "Why are there unknown owners in Search Console?", a: "Attackers verify themselves as owners, often by uploading an HTML verification file, so they can submit spam sitemaps. Removing the owner also needs the verification file deleted, or they can verify again." },
    { q: "Should I use the Search Console Removals tool?", a: "It hides URLs from results temporarily but does not remove them from the index. Making the spam URLs return 404 or 410 is what gets them dropped for good; Removals can help hide the worst ones in the meantime." },
    { q: "Will my rankings recover?", a: "Rankings usually improve once the spam is gone and Google has recrawled, but no one can promise a ranking outcome. We remove everything that keeps the spam indexed." },
  ],
  guideSlugs: ["japanese-keyword-spam-hack"],
  relatedPaths: ["/wordpress-security/malware-removal/", "/wordpress-security/blacklist-removal/", "/guides/japanese-keyword-spam-hack/"],
  seo: {
    title: "WordPress SEO Spam and Japanese Keyword Hack Cleanup",
    description: "Japanese or spam pages showing in Google for your domain? We remove the generator code, take back Search Console and help Google drop the spam pages.",
  },
  image: { slot: "service-seo-spam-cleanup", alt: "Google search results for a site: query showing Japanese spam titles on a WordPress domain" },
});
