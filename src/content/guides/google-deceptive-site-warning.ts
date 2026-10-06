import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "google-deceptive-site-warning",
  title: "Deceptive site ahead warning on WordPress",
  h1: "Remove the Google \"Deceptive site ahead\" warning",
  errorText: "Deceptive site ahead",
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
  safeChecks: [
    "Enter your domain on Google's Safe Browsing site status page at transparencyreport.google.com to confirm the warning and see what Google reports.",
    "In Google Search Console, open Security and Manual Actions then Security issues, and save the sample URLs Google lists.",
  ],
  whenToCallUs:
    "Once Google's site status page or Search Console confirms the warning, the site has to be fully cleaned before a review request can succeed. A failed review can slow down later ones, so a partial cleanup costs more than it saves. That is where we take over, from tracing every flagged URL to sending the review.",
  parentService: "blacklist-removal",
  urgency: "critical",
  faqs: [
    { q: "How long until Google removes the warning?", a: "Google sets the review timing. We request the review as soon as the site is clean, and the warning is lifted once Google confirms it." },
    { q: "Can I ask Google to remove it before cleaning?", a: "A review request on a site that is still infected will be rejected, and repeated failed requests can slow down later reviews. Clean first, then request." },
    { q: "I do not use Search Console. Is that a problem?", a: "We can help you verify the site in Search Console. It is the only way to see Google's exact findings and to request a review." },
  ],
  seo: {
    title: "Remove the Deceptive Site Ahead Warning",
    description: "Chrome showing \"Deceptive site ahead\" for your WordPress site? We clean the cause, close the way in and request a Google review once it is clean.",
  },
  image: { slot: "illustration-google-deceptive-site-warning", alt: "A red browser warning page reading Deceptive site ahead in front of a WordPress site" },
});
