import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "locked-out-of-wp-admin",
  category: "access",
  title: "Locked out of WordPress admin",
  h1: "Get back into a locked WordPress admin",
  symptoms: [
    "The login screen says \"Error: The password you entered for the username admin is incorrect.\" even with the right password",
    "After logging in you see \"Sorry, you are not allowed to access this page.\"",
    "A security plugin shows a lockout message after too many failed login attempts",
    "The usual /wp-admin or /wp-login.php address returns a 404 because the login URL was changed",
    "Your account has lost its Administrator role or no longer exists",
  ],
  likelyCauses: [
    "A security plugin lockout, IP block or changed login URL nobody wrote down",
    "Administrator role or capabilities changed in the database by a plugin, a bad migration or an attacker",
    "The admin account's password or email changed without your knowledge",
    "A plugin or theme error that only appears when wp-admin loads",
    "Two-factor authentication tied to a phone or app you no longer have",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Check user records, roles, security plugin logs and error logs to see why access is refused." },
    { verb: "Back up", detail: "Copy the database and files before changing any user or plugin settings." },
    { verb: "Repair", detail: "Restore your administrator account and role, lift the lockout or reset two-factor, and fix any error blocking wp-admin." },
    { verb: "Verify", detail: "Confirm you can log in, reach every admin screen and that no unknown admin accounts exist." },
    { verb: "Harden", detail: "If someone else changed your account, check for a compromise and set up strong passwords and two-factor you can recover." },
  ],
  safeChecks: [
    "Try logging in from a private window or a different network, such as your phone on mobile data. IP lockouts often only block one address.",
    "Use the \"Lost your password?\" link on the login page and check your inbox and spam folder for the reset email.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Can you get me back in without my old password?", a: "Yes, with hosting or database access. We can reset the password or create a fresh administrator account directly, then remove any temporary access afterwards." },
    { q: "How do I know if I was hacked?", a: "Signs include an admin email you do not recognise, unknown administrator users or your role being downgraded. We check users and logs and tell you plainly what we find." },
    { q: "I changed my login URL with a plugin and forgot it. What now?", a: "The custom URL is stored in the plugin's settings. With file or database access we can find it or pause the plugin so the normal login page works again." },
    { q: "Do you need my hosting login?", a: "We need hosting control panel, SFTP or database access, since WordPress admin itself is what is locked. We send a checklist so you can grant temporary access and revoke it after." },
  ],
  relatedSlugs: ["login-redirect-loop", "password-reset-not-working", "unknown-admin-users", "hacked"],
  seo: {
    title: "Locked Out of WordPress Admin? We Fix It | FixMyWP",
    description: "Can't log in to wp-admin? We restore your administrator account, lift security lockouts and check whether someone else changed your access.",
  },
  image: { slot: "illustration-locked-out-of-wp-admin", alt: "The WordPress login screen with a padlock and a login error message" },
});
