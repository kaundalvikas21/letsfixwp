import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "wordpress-not-sending-email",
  category: "email",
  title: "WordPress not sending email",
  h1: "Fix WordPress not sending email",
  symptoms: [
    "Contact forms say the message was sent, but nothing arrives",
    "Password reset shows \"The email could not be sent. Possible reason: your host may have disabled the mail() function.\"",
    "New user and admin notification emails never arrive",
    "Emails land in spam, or Gmail shows them as sent \"via\" your host's server name",
  ],
  likelyCauses: [
    "The host blocks or limits PHP mail(), which WordPress uses by default",
    "No SPF, DKIM or DMARC records authorizing the server to send for your domain",
    "A From address on a different domain to the site, such as a Gmail address, which inbox providers reject",
    "An SMTP password that changed, or a Google or Microsoft account that now requires an app password or OAuth",
    "A form plugin sending to the wrong address or with a broken notification setting",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Send test emails from WordPress and the form plugin, read the mail log and check the message headers to see where delivery fails." },
    { verb: "Back up", detail: "Copy files and database before changing mail or plugin settings." },
    { verb: "Repair", detail: "Connect WordPress to authenticated SMTP or a transactional email service and fix the From address and form notification settings." },
    { verb: "Verify", detail: "Test password resets, form submissions and admin notices and confirm they reach the inbox." },
    { verb: "Harden", detail: "Set up SPF, DKIM and DMARC with your domain provider and turn on email logging so the next failure is easy to spot." },
  ],
  safeChecks: [
    "Use the Lost your password link on your login page for your own account, then check your inbox and spam folder.",
    "Find out which service handles email for your domain, such as Google Workspace, Microsoft 365 or your host. We need to know where mail should come from.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why did email stop working when nothing changed?", a: "Something outside WordPress usually changed: the host tightened mail limits, an inbox provider raised its rules, or an email password was reset. The site itself may be unchanged." },
    { q: "Have I lost the messages people sent through my forms?", a: "Not necessarily. Many form plugins, such as Gravity Forms and WPForms, save entries in the database even when the email fails. We can check what was stored." },
    { q: "Do I need an SMTP plugin?", a: "For dependable delivery, yes. Sending through an authenticated service with proper SPF, DKIM and DMARC is what inbox providers expect from websites today." },
    { q: "Will this fix emails going to spam?", a: "Authentication fixes the most common reason. Content, sending reputation and the recipient's own filters also play a part, so we test with real inboxes after the change." },
  ],
  relatedSlugs: ["woocommerce-emails-not-sending", "password-reset-not-working", "locked-out-of-wp-admin", "plugin-conflict"],
  seo: {
    title: "WordPress Not Sending Email? We Fix It | FixMyWP",
    description: "Contact forms and password resets not arriving? We set up authenticated SMTP and SPF, DKIM and DMARC so WordPress email reaches the inbox.",
  },
  image: { slot: "illustration-wordpress-not-sending-email", alt: "A contact form with a sent message and an empty email inbox beside it" },
});
