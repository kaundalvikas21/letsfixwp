import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "japanese-keyword-spam-hack",
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
  safeChecks: [
    "Search Google for site:yourdomain.com (with your domain). If you see Japanese titles or product listings you did not create, the site is affected.",
    "In Google Search Console, open Settings then Users and permissions and note any owner you do not recognise. Leave it for now, as the attacker can re-add themselves until their file is removed.",
  ],
  whenToCallUs:
    "If a site: search shows Japanese pages you never made, the site is compromised even though it looks normal to you. The spam generator, the cloaking code and the attacker's Search Console verification all have to go together, or the pages come back. Bring us in before you remove anything from Search Console or the server.",
  parentService: "seo-spam-cleanup",
  urgency: "high",
  faqs: [
    { q: "Why can I not see the spam pages?", a: "The hack uses cloaking: it serves spam to search engines and normal pages to everyone else. That is why it often goes unnoticed for a long time." },
    { q: "Will the spam results vanish from Google straight away?", a: "No. They drop out as Google recrawls and finds them gone. Returning a proper not found response and submitting your clean sitemap helps it along." },
    { q: "Has my site been penalised?", a: "Google may show a security warning or a manual action in Search Console. We check both and handle a review request if one is needed." },
  ],
  seo: {
    title: "Fix the Japanese Keyword Hack in WordPress",
    description: "Japanese spam pages showing for your site in Google? We remove the cloaking code and spam generator, then resubmit your real sitemap to Google.",
  },
  image: { slot: "illustration-japanese-keyword-spam-hack", alt: "Google search results for a WordPress site filled with Japanese spam titles" },
});
