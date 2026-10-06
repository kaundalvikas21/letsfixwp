import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "google-deceptive-site-warning",
  category: "security",
  title: "Deceptive site ahead warning on WordPress",
  h1: "Remove the Google \"Deceptive site ahead\" warning",
  symptoms: [
    "Chrome shows a full red page reading \"Deceptive site ahead\" before your site loads",
    "The warning says attackers \"may trick you into doing something dangerous like installing software or revealing your personal information\"",
    "Some visitors see \"The site ahead contains malware\" instead",
    "Firefox, Safari and other browsers show their own version of the warning",
    "Search Console reports problems under Security issues",
  ],
  likelyCauses: [
    "Phishing pages uploaded into a hidden folder on your hosting",
    "Malicious redirects sending visitors to scam or fake login pages",
    "Injected scripts loading code from domains Google has flagged",
    "A compromised third party script or ad embedded on the site",
    "Malware files left on the server from an earlier hack",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Read the Security issues report in Google Search Console and trace every flagged URL to its source on the server." },
    { verb: "Back up", detail: "Snapshot files and database before cleaning, so your content stays safe." },
    { verb: "Clean", detail: "Remove phishing pages, malware and injected scripts from files and the database, and close the hole they came through." },
    { verb: "Verify", detail: "Confirm the flagged URLs are gone or clean, then submit a review request to Google through Search Console." },
    { verb: "Harden", detail: "Update or remove vulnerable plugins, reset passwords and security keys, and remove unknown users." },
  ],
  safeChecks: [
    "Enter your domain on Google's Safe Browsing site status page at transparencyreport.google.com to confirm the warning and see what Google reports.",
    "In Google Search Console, open Security and Manual Actions then Security issues, and save the sample URLs Google lists.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "How fast can you clean the site?", a: "A hacked site is restored in a day or less. The browser warning is removed by Google after it reviews the cleaned site." },
    { q: "How long until Google removes the warning?", a: "Google sets the review timing. We request the review as soon as the site is clean, and the warning is lifted once Google confirms it." },
    { q: "Can I ask Google to remove it before cleaning?", a: "A review request on a site that is still infected will be rejected, and repeated failed requests can slow down later reviews. Clean first, then request." },
    { q: "I do not use Search Console. Is that a problem?", a: "We can help you verify the site in Search Console. It is the only way to see Google's exact findings and to request a review." },
  ],
  relatedSlugs: ["hacked", "malware-removal", "redirect-hack", "japanese-keyword-spam-hack"],
  seo: {
    title: "Remove the Deceptive Site Ahead Warning | FixMyWP",
    description: "Chrome showing \"Deceptive site ahead\" for your WordPress site? We clean the cause, restore the site in a day or less and request a Google review.",
  },
  image: { slot: "illustration-google-deceptive-site-warning", alt: "A red browser warning page reading Deceptive site ahead in front of a WordPress site" },
});
