import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "unknown-admin-users",
  category: "security",
  title: "Unknown admin users in WordPress",
  h1: "Remove unknown admin users from WordPress",
  symptoms: [
    "The Users screen lists administrator accounts nobody on your team created",
    "The Administrator count above the user list is higher than the rows shown",
    "You receive \"New User Registration\" emails for accounts you did not add",
    "Settings, plugins or passwords change without anyone on your side doing it",
  ],
  likelyCauses: [
    "A plugin vulnerability that lets visitors create accounts or raise their own role",
    "Settings left with \"Anyone can register\" on and the default role set to Administrator",
    "A stolen or guessed admin password",
    "Backdoor code that recreates an admin account each time it is deleted",
    "Code in a theme or mu-plugin that hides an admin from the Users list",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Compare the users and roles in the database against what wp-admin shows, and find how each unknown account was created." },
    { verb: "Back up", detail: "Snapshot files and database before changes, so no legitimate account or content is lost." },
    { verb: "Remove", detail: "Delete rogue accounts, reassign any content they own, and remove backdoor or hiding code from files and the database." },
    { verb: "Verify", detail: "Confirm only your real users remain, check that no account reappears, and scan for other changes the attacker made." },
    { verb: "Harden", detail: "Reset all passwords and security keys to log everyone out, fix registration settings and update the vulnerable plugin." },
  ],
  safeChecks: [
    "In wp-admin, open Settings then General and look at Membership and New User Default Role. If anyone can register as Administrator, note it down.",
    "Open Users and click the Administrator filter. If the number next to Administrator is higher than the accounts listed, a hidden admin exists.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Can I just delete the unknown admin?", a: "You can, but if a backdoor created it, a new one usually appears soon after. The way in has to be found and closed as well." },
    { q: "Does an unknown admin mean I was hacked?", a: "Treat it as a hack until proven otherwise. An attacker with an admin account can install plugins, edit code and read customer data." },
    { q: "How fast can you fix it?", a: "A hacked site is restored in a day or less." },
    { q: "Will removing them delete my content?", a: "No. Any posts or pages tied to a rogue account are reassigned to a real user before it is removed." },
    { q: "Should I change my password now?", a: "Yes, change it, but the change alone does not help if a backdoor or the vulnerable plugin is still present. Security keys also need resetting to end existing logins." },
  ],
  relatedSlugs: ["hacked", "malware-removal", "locked-out-of-wp-admin", "password-reset-not-working"],
  seo: {
    title: "Remove Unknown Admin Users in WordPress | FixMyWP",
    description: "Admin accounts in WordPress you did not create? We remove them, close the hole that made them and restore your site in a day or less.",
  },
  image: { slot: "illustration-unknown-admin-users", alt: "The WordPress Users screen with an unfamiliar administrator account highlighted" },
});
