import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "failed-core-update",
  title: "WordPress update failed",
  h1: "Fix a failed WordPress core update",
  errorText: "An automated WordPress update has failed to complete - please attempt the update again now.",
  symptoms: [
    "An email or dashboard notice reading \"An automated WordPress update has failed to complete\"",
    "The site shows \"Briefly unavailable for scheduled maintenance. Check back in a minute.\" and never comes back",
    "The updater stops with \"Could not create directory.\", \"Could not copy file.\" or \"Download failed.\"",
    "wp-admin keeps showing the \"Database Update Required\" screen, or some admin screens look old and others new",
  ],
  likelyCauses: [
    "The update timed out partway through, leaving a mix of old and new core files",
    "File permissions or ownership that stop WordPress writing to wp-admin and wp-includes",
    "The hosting account running out of disk space or memory while unpacking the update",
    "A leftover .maintenance file or update lock from an interrupted attempt blocking the next one",
    "A security plugin or server firewall blocking the download from wordpress.org",
  ],
  safeChecks: [
    "Write down the exact wording of the failure email or message, including any version number. It tells us which step broke.",
    "Check disk usage in your hosting control panel. An account that is full or nearly full is a common reason updates stop halfway.",
  ],
  whenToCallUs:
    "If one retry fails, or the site is down or stuck in maintenance mode, stop clicking Update. Replacing core files by hand risks overwriting the wrong folder or leaving versions mixed. An engineer can replace wp-admin and wp-includes cleanly and fix whatever made the update fail.",
  parentService: "update-php-errors",
  urgency: "high",
  faqs: [
    { q: "Should I just click Update again?", a: "If the dashboard loads and the notice asks you to retry, one retry is reasonable. If it fails again or the site is down, stop there. Repeat attempts rarely work until the cause, such as permissions or disk space, is fixed." },
    { q: "Will reinstalling WordPress core delete my content?", a: "No. Core files live in wp-admin and wp-includes. Your posts, settings and uploads are in the database and wp-content, which a core repair does not replace." },
    { q: "Is a half-updated site a security risk?", a: "It can be. Minor releases often carry security fixes, and a partial update means some of those fixes may not be in place. It is worth finishing the update properly rather than leaving it." },
    { q: "Should I turn off automatic updates?", a: "We do not recommend it. Automatic minor updates deliver security patches. Once the underlying cause is fixed, they should run without trouble." },
  ],
  seo: {
    title: "WordPress Update Failed? We Repair It",
    description: "Automated WordPress update failed or stuck halfway? We repair core files safely, finish the update and fix the cause so future updates complete.",
  },
  image: { slot: "illustration-failed-core-update", alt: "A WordPress dashboard with a progress bar stopped partway and an update failed warning" },
});
