import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "critical-error-on-this-website",
  category: "down",
  title: "WordPress critical error on this website",
  h1: "Fix \"There has been a critical error on this website\"",
  symptoms: [
    "Every page shows the line \"There has been a critical error on this website.\"",
    "The message adds \"Please check your site admin email inbox for instructions.\"",
    "wp-admin shows the same critical error instead of the dashboard",
    "The admin email received a message titled \"Your Site is Experiencing a Technical Issue\"",
  ],
  likelyCauses: [
    "A PHP fatal error in a plugin or theme, caught by the WordPress fatal error handler",
    "A plugin or theme update that calls a function or class that is no longer there",
    "A PHP version change on the server that the active theme or a plugin cannot run on",
    "The PHP memory limit being reached while a page or admin screen loads",
    "A file left half-written by an interrupted update or upload",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Read the PHP error log and the recovery mode email to find the exact plugin, theme file and line that triggered the fatal error." },
    { verb: "Back up", detail: "Take a full copy of files and database before changing anything, so every step can be rolled back." },
    { verb: "Repair", detail: "Patch, roll back or replace the failing component, or adjust the PHP version or memory limit, keeping your content and settings intact." },
    { verb: "Verify", detail: "Load the home page, key pages, wp-admin, forms and checkout to confirm the error is gone everywhere, not just on one URL." },
    { verb: "Harden", detail: "Tell you which component failed and why, and set up the site so a future update of it can be tested before it goes live." },
  ],
  safeChecks: [
    "Search the site admin email inbox, including spam, for \"Your Site is Experiencing a Technical Issue\". It names the broken plugin or theme and includes a recovery mode login link.",
    "If you updated a plugin just before the error, open your host's file manager, go to wp-content/plugins and rename that plugin's folder (for example add -off to the end). This switches it off without deleting it.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "What is the recovery mode email?", a: "Since WordPress 5.2, when a plugin or theme causes a fatal error WordPress emails the site admin address with the name of the failing component and a special login link. That link lets you into wp-admin with the broken item paused." },
    { q: "I never got the email. What now?", a: "Many sites cannot send email reliably, so the message often never arrives. The same details are in the server's PHP error log, which we read directly." },
    { q: "Is my content gone?", a: "No. The critical error is a code failure. Posts, pages, orders and media stay in the database and come back as soon as the failing code is fixed." },
    { q: "Why did this happen when I did not change anything?", a: "Plugins can update automatically, and hosts sometimes upgrade PHP on their schedule. Either can break older code overnight without anyone logging in." },
    { q: "Should I just delete the plugin that broke it?", a: "Deleting a plugin can also remove its settings and data. Renaming its folder pauses it safely. We fix or replace it so you keep what it did." },
  ],
  relatedSlugs: ["white-screen-of-death", "php-fatal-error", "plugin-conflict", "php-upgrade-broke-site"],
  seo: {
    title: "Fix the WordPress Critical Error | FixMyWP",
    description: "Seeing \"There has been a critical error on this website\"? We find the failing plugin or theme, repair it and get your site back with content intact.",
  },
  image: { slot: "screen-critical-error", alt: "A browser showing the WordPress message: There has been a critical error on this website" },
});
