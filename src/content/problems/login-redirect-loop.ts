import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "login-redirect-loop",
  category: "access",
  title: "WordPress login redirect loop",
  h1: "Fix the WordPress login redirect loop",
  symptoms: [
    "You enter the right username and password and land back on the login page with no error",
    "The address bar shows wp-login.php?redirect_to=...&reauth=1 after every attempt",
    "Login works on one browser or device but loops on another",
    "The loop started after a migration, an SSL change or adding a CDN",
  ],
  likelyCauses: [
    "WordPress Address and Site Address not matching the URL you log in on (http vs https, or www vs non-www)",
    "Login cookies not being saved because of a wrong COOKIE_DOMAIN or cookie path",
    "A caching plugin, server cache or CDN caching wp-login.php or wp-admin",
    "A security or login plugin redirecting the login page to itself",
    "Corrupted or stale login cookies in your browser",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Inspect the login requests, cookies and redirects to find which layer drops your session." },
    { verb: "Back up", detail: "Copy the database and wp-config.php before changing URL or cookie settings." },
    { verb: "Repair", detail: "Align the site URLs, correct cookie settings and exclude login and admin pages from caching." },
    { verb: "Verify", detail: "Log in as each admin and editor role across browsers and devices and confirm sessions stay logged in." },
    { verb: "Harden", detail: "Document the cache and CDN exclusions so a future setting change does not bring the loop back." },
  ],
  safeChecks: [
    "Clear cookies for your site only, then try again. Old login cookies are a common cause.",
    "Open a private window and log in there. If it works, the issue is in your browser. If not, it is on the site.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why is there no error message?", a: "From WordPress's point of view nothing failed. It accepted your password, but the login cookie was not saved or read back, so it asks you to log in again." },
    { q: "Is my password wrong?", a: "No. A wrong password shows an error. A silent return to the login page means the password worked and the session did not stick." },
    { q: "Could my host or CDN be the cause?", a: "Yes. Server caching and CDNs sometimes cache the login page or strip cookies. We check those layers along with WordPress itself." },
    { q: "Will fixing it log out my customers or members?", a: "Changing cookie settings can log everyone out once, which is normal. They simply log in again and stay logged in from then on." },
  ],
  relatedSlugs: ["locked-out-of-wp-admin", "too-many-redirects", "password-reset-not-working", "migration-failed"],
  seo: {
    title: "Fix the WordPress Login Redirect Loop | FixMyWP",
    description: "Logging in just sends you back to wp-login.php? We fix the URL, cookie and cache settings that drop your WordPress session so login works again.",
  },
  image: { slot: "illustration-login-redirect-loop", alt: "A WordPress login form with a circular arrow showing it returns to itself" },
});
