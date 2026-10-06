import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "php-fatal-error",
  category: "errors",
  title: "WordPress PHP fatal error",
  h1: "Fix a PHP fatal error in WordPress",
  symptoms: [
    "A page shows \"Fatal error: Uncaught Error: Call to undefined function\" followed by a file path and line number",
    "Visitors see \"There has been a critical error on this website.\" instead of the page",
    "The admin email receives \"Your Site is Experiencing a Technical Issue\" with a recovery mode link",
    "Errors such as \"Cannot redeclare\" or \"Uncaught TypeError\" appear at the top of the page",
  ],
  likelyCauses: [
    "A plugin or theme calling a function or class that was removed or renamed in an update",
    "Code that is not compatible with the server's PHP version, especially after a move to PHP 8",
    "Two plugins defining the same function or class name",
    "A missing or partly uploaded file that another file depends on",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Read the full error from the PHP log, including the stack trace, to find the exact plugin, theme or file and line at fault." },
    { verb: "Back up", detail: "Take a full copy of files and database before any change so the site can be returned to its current state." },
    { verb: "Repair", detail: "Patch the failing code, update or roll back the component, or restore the missing file, keeping your settings intact." },
    { verb: "Verify", detail: "Reload every page type that was failing, plus wp-admin, and check the log stays clear of new fatal errors." },
    { verb: "Harden", detail: "Turn error display off for visitors and keep logging on privately so future errors are caught before customers see them." },
  ],
  safeChecks: [
    "Search your admin email inbox and spam folder for \"Your Site is Experiencing a Technical Issue\". It names the plugin or theme that failed.",
    "Copy the full error text from the screen or your host's error log, including the file path. It points straight at the faulty component.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "What is a PHP fatal error?", a: "It means PHP hit a problem it cannot continue past, so it stops building the page. In WordPress this is usually caused by a plugin, theme or PHP version mismatch, not by your content." },
    { q: "Is it safe to use the recovery mode link?", a: "Yes. Recovery mode lets an administrator log in with the failing plugin or theme paused, only for that session. It is a good way to get back into wp-admin, but the underlying error still needs fixing." },
    { q: "Why does the error show my server file path?", a: "Error display is switched on, which also exposes server details to visitors. We fix the error and then move logging to a private file." },
    { q: "Will downgrading PHP fix it?", a: "Sometimes, but older PHP versions stop getting security fixes and hosts retire them. Fixing the incompatible code is the lasting answer." },
  ],
  relatedSlugs: ["critical-error-on-this-website", "white-screen-of-death", "php-upgrade-broke-site", "syntax-error"],
  seo: {
    title: "Fix a WordPress PHP Fatal Error | FixMyWP",
    description: "Seeing \"Fatal error: Uncaught Error\" on your WordPress site? We read the error log, repair the failing plugin or theme code and get pages loading again.",
  },
  image: { slot: "illustration-php-fatal-error", alt: "A browser window showing a PHP fatal error message with a file path and line number" },
});
