import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "too-many-redirects",
  title: "Too many redirects WordPress",
  h1: "Fix too many redirects on WordPress",
  errorText: "ERR_TOO_MANY_REDIRECTS",
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
  safeChecks: [
    "Clear cookies for your site only, or open it in a private window. Old cookies can keep a loop going after the cause is fixed.",
    "If you use Cloudflare, look at SSL/TLS settings and note whether the mode is Flexible, Full or Full (strict). Do not change it yet.",
  ],
  whenToCallUs:
    "If the loop is still there in a private window, stop changing the site address, SSL plugin or Cloudflare mode one after another. Each change can add another redirect layer and lock you out of wp-admin as well. An engineer should trace the chain step by step and fix it in the one place it starts.",
  parentService: "login-redirect-issues",
  urgency: "critical",
  faqs: [
    { q: "Is my site hacked?", a: "Usually not. A redirect loop is almost always a settings conflict between WordPress, the server and a CDN. If the site redirects to a different domain instead of looping, that points to a redirect hack." },
    { q: "Why did it start after I added SSL?", a: "Adding HTTPS often means two systems both try to force it, or one sends visitors to https while another sends them back to http. The browser gives up after too many bounces." },
    { q: "Do my visitors see the same error?", a: "Usually yes, if the loop is caused by server or WordPress settings. If only you see it, stale cookies or browser cache are the likely cause." },
    { q: "Can I fix it by changing the site address in Settings > General?", a: "Sometimes, but a wrong value there can lock you out of wp-admin. It is safer to confirm where the loop comes from first, and the address can also be set in wp-config.php if needed." },
  ],
  seo: {
    title: "Fix Too Many Redirects on WordPress",
    description: "ERR_TOO_MANY_REDIRECTS on your WordPress site? We trace the loop across WordPress, server rules and Cloudflare and set one clean HTTPS address.",
  },
  image: { slot: "too-many-redirects", alt: "A Chrome error page saying the site redirected you too many times" },
});
