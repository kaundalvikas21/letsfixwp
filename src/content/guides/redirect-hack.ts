import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "redirect-hack",
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
  safeChecks: [
    "On your phone, in a private browser tab, search Google for your site and tap the result. This is how most redirect hacks show themselves.",
    "In wp-admin, open Settings then General and check that WordPress Address and Site Address both show your own domain. Only look, do not change them.",
  ],
  whenToCallUs:
    "If the redirect shows up when you open your site from a Google result on your phone, the site is infected, and clearing caches or reinstalling a plugin will not remove it. The code usually sits in the database, .htaccess and more than one file, and missing any part brings the redirect back. That is the point to hand it over.",
  parentService: "malware-removal",
  urgency: "critical",
  faqs: [
    { q: "Why can I not see the redirect myself?", a: "Redirect malware is written to hide from site owners. It often skips logged in users, desktop browsers or repeat visitors so the problem goes unnoticed." },
    { q: "Will clearing my cache fix it?", a: "No. The cache may hold infected pages, but the code creating the redirect stays in your files or database until it is removed." },
    { q: "Is my Google ranking affected?", a: "It can be. Google may flag the site or drop pages if visitors are being sent elsewhere. Cleaning it quickly and requesting a review if flagged limits the damage." },
  ],
  seo: {
    title: "Fix the WordPress Redirect Hack",
    description: "Visitors redirected to spam or scam sites? We find the injected script or rule, clean it out and close the way the attacker got into your site.",
  },
  image: { slot: "illustration-redirect-hack", alt: "A phone opening a WordPress site from Google and being sent to a scam page" },
});
