import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "mixed-content-ssl-errors",
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
  safeChecks: [
    "Open the page in a private window and click the padlock or \"Not secure\" label. The browser often names which items are insecure.",
    "Look at Settings > General and check whether both addresses start with https. Just note them, do not change them yet.",
  ],
  whenToCallUs:
    "If the insecure items live in your content, page builder or theme settings, fixing them means a search and replace across the database. A plain replace breaks serialized data and can wipe widget and builder settings, so it needs a full backup and a serialization safe tool. Call us at that point, and straight away if payment fields have stopped loading.",
  parentService: "hosting-migration",
  urgency: "high",
  faqs: [
    { q: "My SSL certificate is valid. Why does it still say Not secure?", a: "The certificate covers the page, but if the page loads any image, script or font over http, the browser marks the whole page as not fully secure." },
    { q: "Can I just install a plugin to force HTTPS?", a: "Plugins that rewrite URLs on the fly can hide the problem, but they add work to every page load and leave the http links in your database. Fixing the stored URLs is cleaner." },
    { q: "Why not run a simple find and replace in the database?", a: "Many plugins store settings as serialized data, which records the length of each text value. A plain replace breaks those lengths and can wipe widget and builder settings. A serialization safe tool avoids that." },
    { q: "Does mixed content affect payments?", a: "It can. Browsers block insecure scripts on secure pages, so payment fields or checkout scripts loaded over http may stop working." },
  ],
  seo: {
    title: "Fix WordPress Mixed Content SSL Errors",
    description: "Padlock missing or Not secure on HTTPS? We find every http resource in your WordPress site and update it safely so the whole site loads securely.",
  },
  image: { slot: "illustration-mixed-content-ssl-errors", alt: "A browser address bar with a broken padlock and a Not secure warning" },
});
