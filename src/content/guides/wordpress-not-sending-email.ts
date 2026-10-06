import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "wordpress-not-sending-email",
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
  safeChecks: [
    "Use the Lost your password link on your login page for your own account, then check your inbox and spam folder.",
    "Find out which service handles email for your domain, such as Google Workspace, Microsoft 365 or your host. We need to know where mail should come from.",
  ],
  whenToCallUs:
    "If you have checked spam and the test email still never arrives, the problem is in how your server sends mail or in your domain's DNS. Setting up SMTP and adding SPF, DKIM and DMARC records changes your domain's email settings, and a wrong record can affect your normal mailbox too. That is where we take over.",
  parentService: "email-not-sending",
  urgency: "high",
  faqs: [
    { q: "Why did email stop working when nothing changed?", a: "Something outside WordPress usually changed: the host tightened mail limits, an inbox provider raised its rules, or an email password was reset. The site itself may be unchanged." },
    { q: "Have I lost the messages people sent through my forms?", a: "Not necessarily. Many form plugins, such as Gravity Forms and WPForms, save entries in the database even when the email fails. We can check what was stored." },
    { q: "Do I need an SMTP plugin?", a: "For dependable delivery, yes. Sending through an authenticated service with proper SPF, DKIM and DMARC is what inbox providers expect from websites today." },
    { q: "Will this fix emails going to spam?", a: "Authentication fixes the most common reason. Content, sending reputation and the recipient's own filters also play a part, so we test with real inboxes after the change." },
  ],
  seo: {
    title: "WordPress Not Sending Email? We Fix It",
    description: "Contact forms and password resets not arriving? We set up authenticated SMTP and SPF, DKIM and DMARC so WordPress email reaches the inbox.",
  },
  image: { slot: "illustration-wordpress-not-sending-email", alt: "A contact form with a sent message and an empty email inbox beside it" },
});
