import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "audit-hardening",
  path: "/wordpress-security/audit-hardening/",
  hub: "wordpress-security",
  intent: "project",
  title: "WordPress security audit and hardening",
  h1: "WordPress security audit and hardening",
  heroLine: "We look for the weak points attackers use in your site, hosting and logins, then close them.",
  summary:
    "We review your WordPress site, hosting and accounts for the weaknesses attackers use, fix what can be fixed safely, and give you a written report of everything else.",
  whoItsFor:
    "Owners who want the gaps closed before an attack, or after a cleanup to make sure it does not happen again. Also stores that hold customer data and need a clear record of their setup.",
  symptoms: [],
  whatWeDo: [
    { verb: "Audit", detail: "Check every plugin and theme against known vulnerabilities and flag abandoned, outdated or pirated ones." },
    { verb: "Review", detail: "Go through admin users, roles, passwords, two factor login, file permissions, wp-config.php settings, PHP version and hosting access." },
    { verb: "Harden", detail: "Disable file editing in wp-admin, correct permissions, enable two factor login, limit login attempts and remove unused plugins and accounts." },
    { verb: "Back up", detail: "Confirm off-site backups exist and test that one can be restored." },
    { verb: "Report", detail: "Write up every finding ranked by risk, what we changed and what still needs a decision from you." },
  ],
  deliverables: [
    "A written audit report with findings ranked by risk",
    "A list of every hardening change we made",
    "Admin and user accounts reviewed and cleaned up",
    "A tested backup restore",
    "Recommendations for the issues that need your decision",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "I already have a security plugin. Do I need an audit?", a: "A security plugin covers what runs inside WordPress. An audit also looks at hosting access, file permissions, backups, abandoned plugins and who holds admin accounts, which plugins do not check." },
    { q: "Can hardening break my site?", a: "Some changes can. Turning off XML-RPC, for example, affects Jetpack and the WordPress mobile app. We check what your site uses and test each change before leaving it in place." },
    { q: "What access do you need?", a: "Hosting control panel or SFTP access, a WordPress admin account and, if you have it, access to your DNS and backup service. You can revoke all of it when we finish." },
    { q: "Is an audit worth it after a malware cleanup?", a: "Yes. A cleanup closes the hole that was used. An audit looks for the other weaknesses that could be used next." },
    { q: "Do you offer ongoing security monitoring?", a: "Ongoing updates, monitoring and backups are part of our care plans. The audit is a one time project you can start with either way." },
  ],
  guideSlugs: [],
  relatedPaths: ["/wordpress-security/malware-removal/", "/wordpress-maintenance/care-plans/", "/compare/care-plan-vs-pay-as-you-go-support/"],
  seo: {
    title: "WordPress Security Audit and Hardening",
    description: "A WordPress security audit of plugins, users, hosting access and backups, with safe hardening changes and a written report ranked by risk.",
  },
  image: { slot: "service-audit-hardening", alt: "A WordPress Users screen filtered to administrators beside a security audit checklist" },
});
