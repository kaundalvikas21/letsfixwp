import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "login-redirect-issues",
  path: "/wordpress-fix/login-redirect-issues/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress login problems fix",
  h1: "Fix WordPress login loops, lockouts and redirect errors",
  heroLine: "Locked out of wp-admin or stuck in a redirect loop? We get you back in and fix the setting responsible.",
  summary:
    "Login loops, too many redirects and missing reset emails usually trace back to wrong site URLs, HTTPS settings, cookies or a security plugin. We get you back into wp-admin and fix the setting that locked you out.",
  whoItsFor:
    "Owners and admins who cannot log in to wp-admin, or whose site keeps redirecting until the browser gives up.",
  symptoms: [
    "The login page reloads back to itself after you enter the right password",
    "The browser shows ERR_TOO_MANY_REDIRECTS or \"This page isn't working\"",
    "The password reset email never arrives",
    "\"Sorry, you are not allowed to access this page.\" after logging in",
    "A security plugin has locked your own account or IP address out",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Check the siteurl and home values, HTTPS and proxy settings, cookie domain and security plugin rules that control logins and redirects." },
    { verb: "Back up", detail: "Copy files and database before editing settings or user records." },
    { verb: "Repair", detail: "Correct URLs and SSL settings, clear lockouts, and reset your password or admin role directly with WP-CLI or in the database when email is not working." },
    { verb: "Verify", detail: "Log in from a clean browser, test password reset and check every page loads without a redirect chain." },
    { verb: "Secure", detail: "Check the lockout was not caused by a compromised account and remove any admin users nobody recognises." },
  ],
  deliverables: [
    "Working admin access for you and your team",
    "Redirect loops removed and site URLs set correctly",
    "Backups taken before the fix",
    "A written note of the cause and a list of admin accounts on the site",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why did a login loop start after moving to HTTPS?", a: "If the siteurl and home settings still use http, or a proxy such as Cloudflare in Flexible SSL mode talks to your server over http, WordPress keeps redirecting between the two versions and never sets a valid login cookie." },
    { q: "Can you reset my password without the reset email?", a: "Yes. With hosting access we can set a new password through WP-CLI or the database, then fix email separately so resets work again." },
    { q: "Why did my account lose its admin rights?", a: "User roles are stored in the database. A plugin bug or a bad migration can damage them, but an unexplained change can also be a sign of a hack, so we check for that too." },
    { q: "Will clearing cookies fix it?", a: "Clearing cookies for your domain fixes a loop caused by a stale cookie. If the loop comes back, the cause is in the site settings or server and needs fixing there." },
  ],
  guideSlugs: ["locked-out-of-wp-admin", "login-redirect-loop", "password-reset-not-working", "too-many-redirects"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-fix/email-not-sending/", "/guides/login-redirect-loop/", "/guides/too-many-redirects/"],
  seo: {
    title: "WordPress Login Loop and Redirect Fix",
    description: "Locked out of wp-admin, stuck in a login loop or seeing too many redirects? We fix the URL, HTTPS or security setting behind it and get you back in.",
  },
  image: { slot: "service-login-redirect-issues", alt: "A browser showing the ERR_TOO_MANY_REDIRECTS error on a WordPress login page" },
});
