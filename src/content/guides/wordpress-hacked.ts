import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "wordpress-hacked",
  title: "WordPress site hacked",
  h1: "Fix a hacked WordPress site",
  errorText: "This site may be hacked",
  symptoms: [
    "Visitors are sent to spam, gambling or scam sites instead of your pages",
    "Google search results show \"This site may be hacked\" under your site name",
    "Browsers show a red \"Deceptive site ahead\" warning before your site loads",
    "Your host has suspended the account or emailed you about malware",
    "Posts, pages or admin users appear that nobody on your team created",
  ],
  likelyCauses: [
    "An outdated plugin or theme with a publicly known vulnerability",
    "A nulled (pirated) theme or plugin that shipped with a backdoor",
    "A weak or reused password on an admin, hosting or FTP account",
    "Another infected site in the same hosting account spreading across folders",
    "A backdoor left behind by an earlier cleanup that was not complete",
  ],
  safeChecks: [
    "Search Google for site:yourdomain.com (with your own domain) and look for pages you never made, such as spam in other languages or pharmacy and casino titles.",
    "In wp-admin, open Users and filter by Administrator. Write down any account you do not recognise, but leave it in place so the cleanup can trace it.",
  ],
  whenToCallUs:
    "Once you have seen clear signs of a hack, stop at looking. Deleting files, users or plugins yourself removes the trail that shows how the attacker got in, and a cleanup that misses one backdoor usually ends in reinfection. Bring us in before you restore a backup or run a cleanup plugin.",
  parentService: "malware-removal",
  urgency: "critical",
  faqs: [
    { q: "Will I lose my content?", a: "No. We back up the site before cleaning and remove only malicious code and accounts. Your posts, pages, products and orders stay." },
    { q: "Can I just restore an old backup?", a: "A backup can hold the same backdoor, and restoring it does not close the hole the attacker used. The site is often reinfected soon after. Cleaning and closing the entry point is what stops it." },
    { q: "What access do you need?", a: "Hosting control panel or SFTP access plus a WordPress admin account. We send a checklist so you can create temporary access and revoke it afterwards." },
    { q: "Do I need to tell my customers?", a: "If customer data such as accounts or orders may have been exposed, you may have legal duties to notify people. We tell you what the evidence shows so you can decide with your adviser." },
  ],
  seo: {
    title: "Hacked WordPress Site Repair",
    description: "WordPress site hacked? We remove the malware and backdoors, close the hole the attacker used and reset every password and security key.",
  },
  image: { slot: "illustration-wordpress-hacked", alt: "A WordPress site with a warning symbol and injected code highlighted in red" },
});
