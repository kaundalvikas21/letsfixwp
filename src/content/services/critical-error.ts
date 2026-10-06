import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "critical-error",
  path: "/wordpress-fix/critical-error/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress critical error fix",
  h1: "Fix \"There has been a critical error on this website\"",
  summary:
    "WordPress shows the critical error message when PHP hits a fatal error, usually from a plugin, the theme, a syntax mistake or exhausted memory. We find the exact error in the logs, fix the code or setting behind it and bring the site back.",
  whoItsFor:
    "Site owners who see the critical error message on the front end, in wp-admin or both, and do not know what caused it.",
  symptoms: [
    "\"There has been a critical error on this website.\" on every page",
    "An email to the admin address titled \"Your Site is Experiencing a Technical Issue\"",
    "\"Allowed memory size of ... bytes exhausted\" in an error message or log",
    "\"Parse error: syntax error, unexpected\" after someone edited functions.php",
    "The error appears only on some pages, or only inside wp-admin",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Read the server error log or turn on WP_DEBUG_LOG privately to get the exact file, line and fatal error behind the message." },
    { verb: "Back up", detail: "Copy the current files and database before we change any code." },
    { verb: "Repair", detail: "Fix the faulty code, roll back or replace the plugin or theme that failed, or raise the PHP memory limit when that is the real cause." },
    { verb: "Verify", detail: "Switch debug output off again, then test the front end, wp-admin and the pages that were failing." },
    { verb: "Report", detail: "Explain which file failed and why, and what to watch for on future updates." },
  ],
  deliverables: [
    "The fatal error fixed at its source and the site loading again",
    "Backups of files and database taken before the fix",
    "A written note naming the file, plugin or theme that failed and what we changed",
    "Debug logging switched back off so errors are not shown to visitors",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "What does the critical error message actually mean?", a: "Since WordPress 5.2, fatal PHP errors are caught and replaced with this generic message so visitors do not see file paths or code. The real error is written to the server log or included in the recovery mode email." },
    { q: "What is recovery mode?", a: "When WordPress catches a fatal error it emails the admin address a special login link. That link opens wp-admin with the failing plugin or theme paused so you can deactivate it. It only helps if your site can send email and the link has not expired." },
    { q: "Will raising the memory limit fix it?", a: "Only when the error is \"Allowed memory size exhausted\" and the usage is legitimate. If a plugin is looping or leaking memory, more memory only delays the same error." },
    { q: "Can I fix a syntax error myself?", a: "If you know which file you edited, restoring its previous version through SFTP or your host's file manager usually brings the site back. Editing PHP in the WordPress theme editor is how many of these errors start, so avoid it on a live site." },
    { q: "Will I lose content?", a: "A fatal error stops pages from loading but does not touch the database. We still back everything up before changing files." },
  ],
  guideSlugs: ["critical-error-on-this-website", "php-fatal-error", "memory-exhausted-error", "syntax-error"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/plugin-theme-conflict/", "/guides/critical-error-on-this-website/", "/guides/memory-exhausted-error/"],
  seo: {
    title: "WordPress Critical Error Fix",
    description: "Seeing \"There has been a critical error on this website\"? We find the fatal PHP error in your logs and fix the plugin, theme or code behind it.",
  },
  image: { slot: "service-critical-error", alt: "A browser showing the WordPress message \"There has been a critical error on this website\"" },
});
