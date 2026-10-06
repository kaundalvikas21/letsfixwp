import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "mixed-content-ssl-errors",
  category: "errors",
  title: "WordPress mixed content SSL errors",
  h1: "Fix mixed content and SSL errors on WordPress",
  symptoms: [
    "The browser shows \"Not secure\" or no padlock even though the site has an SSL certificate",
    "The browser console lists \"Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure image 'http://...'\"",
    "Some images, fonts or styles do not load on the HTTPS version of the site",
    "Sliders, forms or payment fields stop working because insecure scripts are blocked",
  ],
  likelyCauses: [
    "WordPress Address and Site Address still set to http after moving to HTTPS",
    "Hardcoded http links in post content, widgets, menus and theme options",
    "Page builder or plugin settings storing http URLs inside serialized data",
    "Third party scripts, fonts or embeds loaded from http addresses",
    "A CDN or caching layer still serving old http versions of files",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Scan pages and the browser console to list every insecure resource and where it is stored." },
    { verb: "Back up", detail: "Take a full database backup before any search and replace of URLs." },
    { verb: "Repair", detail: "Update site URLs and run a serialization safe search and replace from http to https, then fix the theme, plugin and third party links that remain." },
    { verb: "Verify", detail: "Check key pages, forms and checkout show a clean padlock with no mixed content warnings." },
    { verb: "Harden", detail: "Set a single HTTPS redirect and clear CDN and cache so old http copies stop being served." },
  ],
  safeChecks: [
    "Open the page in a private window and click the padlock or \"Not secure\" label. The browser often names which items are insecure.",
    "Look at Settings > General and check whether both addresses start with https. Just note them, do not change them yet.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "My SSL certificate is valid. Why does it still say Not secure?", a: "The certificate covers the page, but if the page loads any image, script or font over http, the browser marks the whole page as not fully secure." },
    { q: "Can I just install a plugin to force HTTPS?", a: "Plugins that rewrite URLs on the fly can hide the problem, but they add work to every page load and leave the http links in your database. Fixing the stored URLs is cleaner." },
    { q: "Why not run a simple find and replace in the database?", a: "Many plugins store settings as serialized data, which records the length of each text value. A plain replace breaks those lengths and can wipe widget and builder settings. A serialization safe tool avoids that." },
    { q: "Does mixed content affect payments?", a: "It can. Browsers block insecure scripts on secure pages, so payment fields or checkout scripts loaded over http may stop working." },
  ],
  relatedSlugs: ["too-many-redirects", "migration-failed", "payment-gateway-errors", "page-builder-layout-broken"],
  seo: {
    title: "Fix WordPress Mixed Content SSL Errors | FixMyWP",
    description: "Padlock missing or Not secure on HTTPS? We find every http resource in your WordPress site and update it safely so the whole site loads securely.",
  },
  image: { slot: "illustration-mixed-content-ssl-errors", alt: "A browser address bar with a broken padlock and a Not secure warning" },
});
