import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "unknown-admin-users",
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
  safeChecks: [
    "In wp-admin, open Settings then General and look at Membership and New User Default Role. If anyone can register as Administrator, note it down.",
    "Open Users and click the Administrator filter. If the number next to Administrator is higher than the accounts listed, a hidden admin exists.",
  ],
  whenToCallUs:
    "If you find an administrator nobody created, or the count shows a hidden one, do not just delete it and move on. A backdoor or vulnerable plugin can recreate the account, and the attacker may already have changed code or settings. An engineer needs to find how it got there before it is removed.",
  parentService: "malware-removal",
  urgency: "critical",
  faqs: [
    { q: "Can I just delete the unknown admin?", a: "You can, but if a backdoor created it, a new one usually appears soon after. The way in has to be found and closed as well." },
    { q: "Does an unknown admin mean I was hacked?", a: "Treat it as a hack until proven otherwise. An attacker with an admin account can install plugins, edit code and read customer data." },
    { q: "Will removing them delete my content?", a: "No. Any posts or pages tied to a rogue account are reassigned to a real user before it is removed." },
    { q: "Should I change my password now?", a: "Yes, change it, but the change alone does not help if a backdoor or the vulnerable plugin is still present. Security keys also need resetting to end existing logins." },
  ],
  seo: {
    title: "Remove Unknown Admin Users in WordPress",
    description: "Admin accounts in WordPress you did not create? We remove them, close the hole that created them and reset passwords and security keys.",
  },
  image: { slot: "illustration-unknown-admin-users", alt: "The WordPress Users screen with an unfamiliar administrator account highlighted" },
});
