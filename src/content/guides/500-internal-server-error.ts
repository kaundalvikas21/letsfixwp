import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "500-internal-server-error",
  title: "WordPress 500 internal server error",
  h1: "Fix the 500 internal server error in WordPress",
  errorText: "500 Internal Server Error",
  symptoms: [
    "The page shows \"500 Internal Server Error\"",
    "Apache servers show \"The server encountered an internal error or misconfiguration and was unable to complete your request.\"",
    "Chrome shows \"This page isn't working\" with \"HTTP ERROR 500\"",
    "Only wp-admin, or only certain pages, return the error while the rest of the site loads",
  ],
  likelyCauses: [
    "A corrupted or badly edited .htaccess file with rules the server cannot read",
    "A PHP fatal error in a plugin or theme that the server reports as a 500",
    "The PHP memory limit or execution time being exceeded",
    "Wrong file or folder permissions after a migration or manual upload",
    "A PHP version or server module change made by the host",
  ],
  safeChecks: [
    "Open the error log in your hosting control panel and note the most recent lines and their time. They usually name the file or rule causing the 500.",
    "If the error began after a plugin install or update, use your host's file manager to rename that plugin's folder in wp-content/plugins. This disables it without deleting it.",
  ],
  whenToCallUs:
    "If the log names a theme file or WordPress core, or the 500 continues after you disable the last updated plugin, stop there. Changing .htaccess, permissions or PHP settings by trial and error can take down pages that still work. An engineer can read the full logs and fix the right layer.",
  parentService: "server-errors",
  urgency: "critical",
  faqs: [
    { q: "What does a 500 error actually mean?", a: "It is the server saying something went wrong but not saying what. The real reason is written to the server error log, which is why reading the log is our first step." },
    { q: "Is the problem my host or my site?", a: "It can be either. Most WordPress 500 errors come from the site itself, such as .htaccess or a plugin, but a host change to PHP or server modules can cause it too. The logs tell us which." },
    { q: "Will reinstalling WordPress fix it?", a: "Rarely, and it can make things worse if files are overwritten. The fault is usually in a plugin, theme or server file that a reinstall does not touch." },
    { q: "Why does only wp-admin show a 500?", a: "Admin screens load more code and use more memory than the front end, so a memory limit or an admin only plugin error often shows up there first." },
  ],
  seo: {
    title: "Fix the WordPress 500 Internal Server Error",
    description: "WordPress site showing a 500 internal server error? We read the server logs, fix the .htaccess, plugin or PHP fault and get your pages loading again.",
  },
  image: { slot: "illustration-500-internal-server-error", alt: "A browser window showing a 500 Internal Server Error message on a WordPress site" },
});
