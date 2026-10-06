import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "blacklist-removal",
  path: "/wordpress-security/blacklist-removal/",
  hub: "wordpress-security",
  intent: "fix",
  title: "Google blacklist removal for WordPress",
  h1: "Remove Google and browser warnings from your WordPress site",
  summary:
    "Google Safe Browsing, antivirus vendors and email blocklists flag sites that serve malware or phishing. We remove the cause from your WordPress site first, then request reviews so the warnings come down.",
  whoItsFor:
    "Owners whose visitors see a red warning before the site loads, whose search listing says the site may be hacked, or whose domain has landed on a blocklist.",
  symptoms: [
    "Chrome shows a red \"Deceptive site ahead\" or \"Dangerous site\" warning",
    "Google results show \"This site may be hacked\" under your site name",
    "Search Console lists issues under Security issues",
    "Antivirus software blocks your domain",
    "Email from your domain bounces because it is on a spam blocklist",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Check Search Console Security issues, Google Safe Browsing status and the main blocklists, and find the pages or files they flagged." },
    { verb: "Clean", detail: "Remove the malware, phishing pages or spam behind the flag, because a review requested while it remains is rejected." },
    { verb: "Request", detail: "Submit a review in Search Console and to each blocklist with a clear account of what was found and removed." },
    { verb: "Verify", detail: "Rescan the site, including pages shown only to search visitors or mobile users, and check for anything the flag did not mention." },
    { verb: "Monitor", detail: "Follow each review until it closes and act on any further findings." },
  ],
  deliverables: [
    "The flagged malware or phishing content removed",
    "Review requests submitted to Google and each blocklist involved",
    "Backups taken before and after the cleanup",
    "A written record of what was flagged, removed and requested",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "How long does Google take to remove the warning?", a: "Google sets the timing and nobody outside Google can speed it up. A request submitted while any malware remains is rejected, which delays things further, so we clean and rescan before asking." },
    { q: "Do I need Search Console access?", a: "Yes. Review requests are sent from Search Console by a verified owner. If the site is not verified yet, we help you add it." },
    { q: "My site looks fine to me. Why is it flagged?", a: "Malware often cloaks itself, showing harmful content only to visitors from Google, to mobile users or to people who are not logged in. Admins browsing their own site see nothing wrong." },
    { q: "Will my search rankings come back?", a: "Rankings usually recover once the warning is gone and spam pages are removed, but no one can promise a ranking outcome. We remove everything that keeps the site flagged." },
  ],
  guideSlugs: ["google-deceptive-site-warning"],
  relatedPaths: ["/wordpress-security/malware-removal/", "/wordpress-security/seo-spam-cleanup/", "/guides/google-deceptive-site-warning/"],
  seo: {
    title: "Google Blacklist and Deceptive Site Warning Removal",
    description: "Red \"Deceptive site ahead\" warning or \"This site may be hacked\" in Google? We clean the cause, then request reviews from Google and blocklists.",
  },
  image: { slot: "service-blacklist-removal", alt: "Chrome's red \"Deceptive site ahead\" warning page" },
});
