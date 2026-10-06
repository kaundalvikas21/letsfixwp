import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "hacked",
  legacySlug: "wordpress-hacked-fix",
  category: "security",
  title: "WordPress site hacked",
  h1: "Fix a hacked WordPress site",
  symptoms: [
    "Visitors are sent to spam, gambling or scam sites instead of your pages",
    "Google search results show \"This site may be hacked\" under your site name",
    "Browsers show a red \"Deceptive site ahead\" warning before your site loads",
    "Your host has suspended the account or emailed you about malware",
    "Posts, pages or admin users appear that nobody on your team created",
  ],
  likelyCauses: [
    "An outdated plugin or theme with a publicly known vulnerability",
    "A nulled (pirated) theme or plugin that shipped with a backdoor",
    "A weak or reused password on an admin, hosting or FTP account",
    "Another infected site in the same hosting account spreading across folders",
    "A backdoor left behind by an earlier cleanup that was not complete",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Scan every file and the database for injected code, backdoors and rogue users, and find the way the attacker got in." },
    { verb: "Back up", detail: "Snapshot the infected site before cleaning, so nothing of yours is lost and the evidence is kept." },
    { verb: "Clean", detail: "Replace WordPress core, plugins and themes with clean copies, remove backdoors and strip injected code from the database." },
    { verb: "Verify", detail: "Rescan the site, test it as visitors and Google see it, and request a review if Google or your host flagged it." },
    { verb: "Harden", detail: "Close the entry point, update or remove vulnerable plugins, reset all passwords and security keys, and remove unknown accounts." },
  ],
  safeChecks: [
    "Search Google for site:yourdomain.com (with your own domain) and look for pages you never made, such as spam in other languages or pharmacy and casino titles.",
    "In wp-admin, open Users and filter by Administrator. Write down any account you do not recognise, but leave it in place so the cleanup can trace it.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "How fast can you fix a hacked site?", a: "A hacked site is restored in a day or less. We start with the scan and backup as soon as we have access." },
    { q: "Will I lose my content?", a: "No. We back up the site before cleaning and remove only malicious code and accounts. Your posts, pages, products and orders stay." },
    { q: "Can I just restore an old backup?", a: "A backup can hold the same backdoor, and restoring it does not close the hole the attacker used. The site is often reinfected soon after. Cleaning and closing the entry point is what stops it." },
    { q: "Is the cleanup guaranteed?", a: "Yes. Hack cleanups are covered by our 30-day guarantee." },
    { q: "What access do you need?", a: "Hosting control panel or SFTP access plus a WordPress admin account. We send a checklist so you can create temporary access and revoke it afterwards." },
    { q: "Do I need to tell my customers?", a: "If customer data such as accounts or orders may have been exposed, you may have legal duties to notify people. We tell you what the evidence shows so you can decide with your adviser." },
  ],
  relatedSlugs: ["malware-removal", "redirect-hack", "unknown-admin-users", "google-deceptive-site-warning"],
  seo: {
    title: "Hacked WordPress Site Repair | FixMyWP",
    description: "WordPress site hacked? We remove the malware, close the hole the attacker used and restore your site in a day or less, with a 30-day guarantee.",
  },
  image: { slot: "illustration-hacked", alt: "A WordPress site with a warning symbol and injected code highlighted in red" },
});
