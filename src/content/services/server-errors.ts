import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "server-errors",
  path: "/wordpress-fix/server-errors/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress 500, 502 and 503 error fix",
  h1: "Fix 500, 502 and 503 errors on WordPress",
  heroLine: "A 500, 502 or 503 page instead of your site. We read the server logs and fix the real fault.",
  summary:
    "500, 502 and 503 errors come from the web server, not from WordPress itself, so the real cause sits in the server and PHP logs. We read those logs, separate hosting problems from WordPress problems and fix the one that is failing.",
  whoItsFor:
    "Owners who see a server error page instead of their site, or an \"HTTP error.\" when uploading images, and cannot tell whether WordPress or the host is to blame.",
  symptoms: [
    "\"500 Internal Server Error\" on some or all pages",
    "\"502 Bad Gateway\" from Nginx or Cloudflare",
    "\"503 Service Unavailable\", often during busy periods",
    "\"HTTP error.\" when uploading images to the Media Library",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Read the web server, PHP-FPM and WordPress logs to see whether the request failed in .htaccess, in PHP or upstream at the host." },
    { verb: "Back up", detail: "Copy files and database before changing server rules or code." },
    { verb: "Repair", detail: "Fix broken .htaccess rules, PHP memory and execution limits, slow plugin code that exhausts PHP workers, or image library and upload size settings." },
    { verb: "Verify", detail: "Load the failing pages, run uploads and test wp-admin to confirm the errors are gone." },
    { verb: "Report", detail: "Tell you what failed and, where the host must act, give you the log evidence to send them." },
  ],
  deliverables: [
    "The server errors fixed and the affected pages loading",
    "Backups taken before the fix",
    "A written note of the cause, with log excerpts where the host is involved",
    "Image uploads working again when that was the issue",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "What is the difference between 500, 502 and 503?", a: "A 500 means the server hit an error running the request, often bad .htaccess rules or a PHP fatal error. A 502 means a proxy such as Nginx or Cloudflare got no valid reply from PHP behind it. A 503 means the server is refusing requests for now, because it is overloaded or in maintenance." },
    { q: "Is it my host or WordPress?", a: "Either can be the cause. The logs usually settle it. If a plugin is exhausting PHP workers, changing hosts will not help. If the server is out of resources, changing plugins will not help." },
    { q: "Why do image uploads fail with \"HTTP error.\"?", a: "Common causes are an image larger than the upload limit, PHP running out of memory while WordPress creates thumbnails, the image library failing on a large file, or wrong folder permissions on wp-content/uploads." },
    { q: "Can a .htaccess file cause a 500 error?", a: "Yes. One bad rule added by a plugin or by hand can break every request. Renaming .htaccess and then saving Settings, Permalinks in wp-admin lets WordPress write a fresh default copy." },
  ],
  guideSlugs: ["500-internal-server-error", "502-bad-gateway", "503-service-unavailable", "http-error-uploading-images"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/database-connection-error/", "/guides/500-internal-server-error/", "/guides/503-service-unavailable/"],
  seo: {
    title: "WordPress 500, 502 and 503 Error Fix",
    description: "WordPress showing a 500, 502 or 503 error, or failing image uploads? We read the server logs, find whether WordPress or the host is at fault and fix it.",
  },
  image: { slot: "service-server-errors", photo: "alert", alt: "A browser showing a 502 Bad Gateway error page in front of a WordPress site" },
});
