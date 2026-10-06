import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "japanese-keyword-spam-hack",
  category: "security",
  title: "Japanese keyword hack in WordPress",
  h1: "Fix the Japanese keyword spam hack",
  symptoms: [
    "Google results for your domain show Japanese titles and descriptions you never wrote",
    "Spam pages selling brand name goods appear at random URLs on your domain",
    "Your home page looks normal, but Google shows different content",
    "Search Console lists an owner or sitemap you did not add",
    "Search traffic to your real pages drops while unknown pages get indexed",
  ],
  likelyCauses: [
    "Cloaking code that shows spam only to Googlebot and hides it from you",
    "Injected PHP in theme, plugin or core files that generates spam pages on the fly",
    "Rewrite rules in .htaccess sending spam URLs to the attacker's script",
    "A Google verification file uploaded by the attacker to take over Search Console",
    "An outdated or nulled plugin used as the way in",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Fetch pages as Googlebot, find the cloaking and page generator code, and check Search Console for rogue owners and sitemaps." },
    { verb: "Back up", detail: "Snapshot files and database before cleaning, so your real content is safe." },
    { verb: "Clean", detail: "Remove the spam generator, cloaking code, rogue verification files and sitemaps, and restore clean core, theme and plugin files." },
    { verb: "Verify", detail: "Confirm spam URLs now return not found, test pages with URL Inspection, and resubmit your real sitemap." },
    { verb: "Harden", detail: "Remove unknown Search Console owners, close the entry point, and reset passwords and security keys." },
  ],
  safeChecks: [
    "Search Google for site:yourdomain.com (with your domain). If you see Japanese titles or product listings you did not create, the site is affected.",
    "In Google Search Console, open Settings then Users and permissions and note any owner you do not recognise. Leave it for now, as the attacker can re-add themselves until their file is removed.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "How fast can you fix it?", a: "A hacked site is restored in a day or less. Google then needs to recrawl the site before the spam results disappear." },
    { q: "Why can I not see the spam pages?", a: "The hack uses cloaking: it serves spam to search engines and normal pages to everyone else. That is why it often goes unnoticed for a long time." },
    { q: "Will the spam results vanish from Google straight away?", a: "No. They drop out as Google recrawls and finds them gone. Returning a proper not found response and submitting your clean sitemap helps it along." },
    { q: "Has my site been penalised?", a: "Google may show a security warning or a manual action in Search Console. We check both and handle a review request if one is needed." },
  ],
  relatedSlugs: ["hacked", "malware-removal", "google-deceptive-site-warning", "posts-returning-404"],
  seo: {
    title: "Fix the Japanese Keyword Hack in WordPress | FixMyWP",
    description: "Japanese spam pages showing for your site in Google? We remove the cloaking code and spam generator and restore your WordPress site in a day or less.",
  },
  image: { slot: "illustration-japanese-keyword-spam-hack", alt: "Google search results for a WordPress site filled with Japanese spam titles" },
});
