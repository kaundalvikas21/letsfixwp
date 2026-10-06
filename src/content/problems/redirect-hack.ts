import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "redirect-hack",
  category: "security",
  title: "WordPress redirect hack",
  h1: "Fix the WordPress redirect hack",
  symptoms: [
    "Visitors who click your site in Google land on a scam, gambling or adult site",
    "The redirect happens on phones but not on your desktop, or only on a first visit",
    "Pages show a fake \"Click Allow to verify that you are not a robot\" prompt",
    "Visitors see fake prize or virus alert pages instead of your content",
    "The site looks normal to you while you are logged in to wp-admin",
  ],
  likelyCauses: [
    "Malicious JavaScript injected into posts, widgets or the wp_options table",
    "Rewrite rules added to .htaccess that redirect only search or mobile visitors",
    "The WordPress Address or Site Address settings changed to an attacker's domain",
    "Infected plugin or theme files, often header.php or functions.php",
    "A fake plugin installed through a stolen admin account",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Reproduce the redirect as a mobile and search visitor, then trace it to the exact script, rule or setting that triggers it." },
    { verb: "Back up", detail: "Snapshot files and database before cleaning, so your content is safe." },
    { verb: "Clean", detail: "Remove injected scripts from the database, strip malicious rewrite rules and restore clean plugin, theme and core files." },
    { verb: "Verify", detail: "Test again from different devices and referrers, and confirm Google sees your real pages." },
    { verb: "Harden", detail: "Close the way in, remove rogue accounts and plugins, and reset passwords and security keys." },
  ],
  safeChecks: [
    "On your phone, in a private browser tab, search Google for your site and tap the result. This is how most redirect hacks show themselves.",
    "In wp-admin, open Settings then General and check that WordPress Address and Site Address both show your own domain. Only look, do not change them.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why can I not see the redirect myself?", a: "Redirect malware is written to hide from site owners. It often skips logged in users, desktop browsers or repeat visitors so the problem goes unnoticed." },
    { q: "How fast can you fix it?", a: "A hacked site is restored in a day or less." },
    { q: "Will clearing my cache fix it?", a: "No. The cache may hold infected pages, but the code creating the redirect stays in your files or database until it is removed." },
    { q: "Is my Google ranking affected?", a: "It can be. Google may flag the site or drop pages if visitors are being sent elsewhere. Cleaning it quickly and requesting a review if flagged limits the damage." },
  ],
  relatedSlugs: ["hacked", "malware-removal", "google-deceptive-site-warning", "too-many-redirects"],
  seo: {
    title: "Fix the WordPress Redirect Hack | FixMyWP",
    description: "Visitors redirected to spam or scam sites? We find the injected script or rule, clean it out and restore your WordPress site in a day or less.",
  },
  image: { slot: "illustration-redirect-hack", alt: "A phone opening a WordPress site from Google and being sent to a scam page" },
});
