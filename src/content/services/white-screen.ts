import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "white-screen",
  path: "/wordpress-fix/white-screen/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress white screen of death fix",
  h1: "Fix the WordPress white screen of death",
  heroLine: "Your site or wp-admin shows a blank white page. We find the hidden PHP error and repair its source.",
  summary:
    "A blank white page with no error usually means PHP stopped with its error output hidden. We find the hidden error in the server logs, fix the plugin, theme or setting that caused it and bring your pages back.",
  whoItsFor:
    "Owners who see an empty white page on their site or in wp-admin and have nothing on screen to tell them why.",
  symptoms: [
    "The site loads as a completely blank white page",
    "wp-admin is also blank, or goes white right after you log in",
    "Only some pages, such as checkout or a single post type, turn white",
    "View source in the browser shows an empty page",
    "The screen went white after an update, a new plugin or a code edit",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Check the PHP and web server error logs, and enable WP_DEBUG_LOG privately, to surface the error the white screen is hiding." },
    { verb: "Back up", detail: "Copy files and database before we disable or change anything." },
    { verb: "Repair", detail: "Fix or replace the failing plugin or theme, correct broken code, or adjust PHP memory and execution limits when they are the cause." },
    { verb: "Verify", detail: "Test the front end, wp-admin and logged in pages, and clear page and object caches so no blank copies are served." },
    { verb: "Report", detail: "Tell you what caused the white screen and what we changed." },
  ],
  deliverables: [
    "Your pages and wp-admin loading again",
    "Backups taken before the fix",
    "A written note of the error we found and how it was fixed",
    "Caches cleared so visitors do not keep seeing a blank page",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why is there no error message at all?", a: "On live servers PHP is usually set not to display errors. When a fatal error happens before WordPress can show its own notice, the browser receives an empty response, so you see white. The error is still recorded in the server log." },
    { q: "Is this the same as the critical error message?", a: "It is often the same kind of fatal PHP error. Newer WordPress versions catch most of them and show the critical error notice, but errors that happen very early, or setups that bypass that handler, still produce a white screen." },
    { q: "Can a cache cause a white screen?", a: "Yes. If a caching plugin or the host's cache stored a blank page while the site was broken, visitors can keep seeing it after the cause is fixed. We purge every cache layer as part of the fix." },
    { q: "Should I delete plugins to fix it?", a: "Do not delete them, because that can remove their settings and data. Renaming a plugin's folder in wp-content/plugins turns it off safely and keeps everything." },
  ],
  guideSlugs: ["white-screen-of-death"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/critical-error/", "/guides/white-screen-of-death/"],
  seo: {
    title: "WordPress White Screen of Death Fix",
    description: "Blank white page on your WordPress site or in wp-admin? We find the hidden PHP error in your logs and fix the plugin, theme or setting behind it.",
  },
  image: { slot: "service-white-screen", photo: "night-desk", alt: "A browser window showing a completely blank white WordPress page" },
});
