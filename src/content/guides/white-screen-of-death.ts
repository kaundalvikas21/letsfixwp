import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "white-screen-of-death",
  title: "WordPress white screen of death",
  h1: "Fix the WordPress white screen of death",
  symptoms: [
    "Every page of the site loads as a completely blank white page",
    "The front end is blank but wp-admin still loads, or the other way round",
    "No error message appears, even when you view the page source",
    "The blank page started right after a plugin, theme or PHP update",
  ],
  likelyCauses: [
    "A PHP fatal error with error display turned off, so the page dies silently",
    "A plugin or theme calling a function that no longer exists after an update",
    "The PHP memory limit being hit partway through rendering the page",
    "A corrupted or half-uploaded file in the active theme or a plugin",
    "A PHP version change on the server that older code cannot run on",
  ],
  safeChecks: [
    "Open yoursite.com/wp-admin. If the dashboard loads, the fault is in the theme or a front end plugin, not the whole install.",
    "Check your host's control panel for a PHP error log and note the most recent line. It usually names the broken file.",
  ],
  whenToCallUs:
    "If wp-admin is blank too, or the error log is empty or you cannot find one, the cause is not visible from outside. Turning on debugging on a live site needs care so errors are logged privately instead of shown to visitors. That is the point to hand it to an engineer.",
  parentService: "white-screen",
  urgency: "critical",
  faqs: [
    { q: "Will I lose my posts or pages?", a: "No. A white screen is a code failure, not data loss. Your posts, pages and media stay in the database and come back as soon as the faulty code is fixed." },
    { q: "Why is there no error message?", a: "Most hosts hide PHP errors from visitors for security. The error still happens, it is just written to a log instead of the screen. We read that log to find the cause." },
    { q: "Can I just restore a backup?", a: "Sometimes, but a restore also rolls back orders, form entries and posts made since the backup. Fixing the failing file keeps everything that happened after it." },
    { q: "Do you need my hosting login?", a: "We need either hosting control panel access or SFTP plus a WordPress admin account. We send you a checklist so you can create temporary access and revoke it after." },
  ],
  seo: {
    title: "Fix the WordPress White Screen of Death",
    description: "Blank white page on your WordPress site? We find the PHP error behind it, repair the failing plugin or theme and get the site back without losing content.",
  },
  image: { slot: "white-screen-of-death", alt: "A WordPress site showing a completely blank white page in the browser" },
});
