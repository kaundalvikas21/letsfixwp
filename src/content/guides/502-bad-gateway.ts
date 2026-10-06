import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "502-bad-gateway",
  title: "WordPress 502 bad gateway",
  h1: "Fix the 502 bad gateway error in WordPress",
  errorText: "502 Bad Gateway",
  symptoms: [
    "The page shows \"502 Bad Gateway\", often with \"nginx\" printed underneath",
    "Sites behind Cloudflare show a \"Bad gateway\" page with \"Error code 502\"",
    "Chrome shows \"This page isn't working\" with \"HTTP ERROR 502\"",
    "The error comes and goes, often clearing after a refresh",
    "Long admin tasks such as imports, bulk edits or saving a large page end in a 502",
  ],
  likelyCauses: [
    "PHP-FPM crashed, stopped or restarted, so the web server got no usable answer from PHP",
    "All PHP workers busy, or a single request running longer than the web server is willing to wait",
    "A plugin or theme fault that kills the PHP process partway through a request",
    "A CDN or proxy such as Cloudflare that cannot reach your server, or a server firewall blocking the proxy",
    "Host maintenance, a server restart or a server overloaded by traffic or bots",
  ],
  safeChecks: [
    "Wait a minute, then reload the page in a private window and on mobile data. If it loads, the 502 was a short server restart, but note the time in case it repeats.",
    "Check your host's status page, and Cloudflare's status page if you use Cloudflare. A Cloudflare 502 page also shows whether the failure is at Cloudflare or at your host.",
    "If your control panel has an error log, note the latest lines and their times. Entries mentioning \"upstream\" or \"php-fpm\" mean PHP behind the web server failed to answer.",
  ],
  whenToCallUs:
    "If the 502 keeps coming back, or your host says the server is healthy, the cause is usually PHP processes on your site crashing or timing out. Finding the request that does it needs server and PHP log access. That is the point to bring in an engineer.",
  parentService: "server-errors",
  urgency: "critical",
  faqs: [
    { q: "What does 502 bad gateway mean?", a: "A server in front of WordPress, such as nginx, a load balancer or Cloudflare, asked the next server for the page and got an invalid answer or none at all. The fault is behind that gateway, usually in PHP." },
    { q: "Is the problem my host or my site?", a: "It can be either. A server outage or a PHP service that keeps crashing is on the host side. A plugin that crashes PHP or runs too long is on the site side. The logs show which." },
    { q: "How is a 502 different from a 503 or 504?", a: "A 503 means the server is reachable but turning requests away, usually from load or maintenance. A 504 means the gateway waited and gave up. A 502 means it got a broken answer or no answer from the server behind it." },
    { q: "Will clearing my browser cache fix it?", a: "Rarely. A 502 comes from the server side, so your browser is not the cause. A refresh can work if the server was briefly restarting, but repeated 502s mean something on the server needs fixing." },
  ],
  seo: {
    title: "Fix the WordPress 502 Bad Gateway Error",
    description: "WordPress showing 502 Bad Gateway? We read the server logs, find the PHP, plugin or proxy fault behind it and get your pages loading again.",
  },
  image: { slot: "illustration-502-bad-gateway", alt: "A browser window showing a 502 Bad Gateway message on a WordPress site" },
});
