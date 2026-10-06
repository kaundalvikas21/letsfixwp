import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "too-many-redirects",
  category: "errors",
  title: "Too many redirects WordPress",
  h1: "Fix too many redirects on WordPress",
  symptoms: [
    "Chrome shows \"This page isn't working. yoursite.com redirected you too many times.\" with ERR_TOO_MANY_REDIRECTS",
    "Firefox shows \"The page isn't redirecting properly\"",
    "The loop started after installing an SSL certificate, turning on Cloudflare or changing the site address",
    "The front end, wp-admin or both keep bouncing between http and https, or www and non-www",
  ],
  likelyCauses: [
    "The WordPress Address and Site Address settings not matching how the site is actually served",
    "Cloudflare SSL set to Flexible while the server or WordPress also forces HTTPS",
    "Conflicting redirect rules in .htaccess, the server config and a redirect or SSL plugin",
    "A caching plugin or server cache serving an old redirect",
    "A security or redirect plugin forcing a URL that redirects straight back",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Trace each step of the redirect chain to see which layer sends the visitor back: DNS proxy, server, .htaccess or WordPress." },
    { verb: "Back up", detail: "Copy the database, wp-config.php and server rules before changing any URL setting." },
    { verb: "Repair", detail: "Set one consistent address (https, with or without www) and remove the duplicate or conflicting redirect rules." },
    { verb: "Verify", detail: "Test http, https, www and non-www versions, plus wp-admin and login, in a clean browser." },
    { verb: "Harden", detail: "Document where your redirects now live so a future plugin or CDN change does not start the loop again." },
  ],
  safeChecks: [
    "Clear cookies for your site only, or open it in a private window. Old cookies can keep a loop going after the cause is fixed.",
    "If you use Cloudflare, look at SSL/TLS settings and note whether the mode is Flexible, Full or Full (strict). Do not change it yet.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Is my site hacked?", a: "Usually not. A redirect loop is almost always a settings conflict between WordPress, the server and a CDN. If the site redirects to a different domain instead of looping, that points to a redirect hack." },
    { q: "Why did it start after I added SSL?", a: "Adding HTTPS often means two systems both try to force it, or one sends visitors to https while another sends them back to http. The browser gives up after too many bounces." },
    { q: "Do my visitors see the same error?", a: "Usually yes, if the loop is caused by server or WordPress settings. If only you see it, stale cookies or browser cache are the likely cause." },
    { q: "Can I fix it by changing the site address in Settings > General?", a: "Sometimes, but a wrong value there can lock you out of wp-admin. It is safer to confirm where the loop comes from first, and the address can also be set in wp-config.php if needed." },
  ],
  relatedSlugs: ["mixed-content-ssl-errors", "login-redirect-loop", "redirect-hack", "migration-failed"],
  seo: {
    title: "Fix Too Many Redirects on WordPress | FixMyWP",
    description: "ERR_TOO_MANY_REDIRECTS on your WordPress site? We trace the loop across WordPress, server rules and Cloudflare and set one clean HTTPS address.",
  },
  image: { slot: "screen-too-many-redirects", alt: "A Chrome error page saying the site redirected you too many times" },
});
