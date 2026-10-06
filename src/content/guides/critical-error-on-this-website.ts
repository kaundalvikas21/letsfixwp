import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "critical-error-on-this-website",
  title: "WordPress critical error on this website",
  h1: "Fix \"There has been a critical error on this website\"",
  errorText: "There has been a critical error on this website.",
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
  safeChecks: [
    "Search the site admin email inbox, including spam, for \"Your Site is Experiencing a Technical Issue\". It names the broken plugin or theme and includes a recovery mode login link.",
    "If you updated a plugin just before the error, open your host's file manager, go to wp-content/plugins and rename that plugin's folder (for example add -off to the end). This switches it off without deleting it.",
  ],
  whenToCallUs:
    "If the recovery mode email never arrived and renaming the last updated plugin did not help, the cause is written in the PHP error log. Reading it and fixing the failing code without losing settings is engineer work. Call us before deleting plugins or restoring an old backup.",
  parentService: "critical-error",
  urgency: "critical",
  faqs: [
    { q: "What is the recovery mode email?", a: "Since WordPress 5.2, when a plugin or theme causes a fatal error WordPress emails the site admin address with the name of the failing component and a special login link. That link lets you into wp-admin with the broken item paused." },
    { q: "I never got the email. What now?", a: "Many sites cannot send email reliably, so the message often never arrives. The same details are in the server's PHP error log, which we read directly." },
    { q: "Is my content gone?", a: "No. The critical error is a code failure. Posts, pages, orders and media stay in the database and come back as soon as the failing code is fixed." },
    { q: "Should I just delete the plugin that broke it?", a: "Deleting a plugin can also remove its settings and data. Renaming its folder pauses it safely. We fix or replace it so you keep what it did." },
  ],
  seo: {
    title: "Fix the WordPress Critical Error",
    description: "Seeing \"There has been a critical error on this website\"? We find the failing plugin or theme, repair it and get your site back with content intact.",
  },
  image: { slot: "critical-error-on-this-website", alt: "A browser showing the WordPress message: There has been a critical error on this website" },
});
