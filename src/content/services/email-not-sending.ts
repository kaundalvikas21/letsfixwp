import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "email-not-sending",
  path: "/wordpress-fix/email-not-sending/",
  hub: "wordpress-fix",
  intent: "fix",
  title: "WordPress not sending email fix",
  h1: "Fix WordPress and WooCommerce emails that do not arrive",
  heroLine: "Form notifications, order emails and password resets that never arrive. We send them through authenticated SMTP and test each one.",
  summary:
    "By default WordPress sends mail through PHP on your web server, which many hosts restrict and many inboxes distrust. We route your site's email through authenticated SMTP, set up the DNS records inboxes check, and test every form and order email.",
  whoItsFor:
    "Owners whose contact forms, order confirmations or password resets are not reaching people, or are landing in spam.",
  symptoms: [
    "Contact form submissions never reach your inbox",
    "Customers do not receive WooCommerce order confirmation emails",
    "Password reset emails never arrive",
    "Emails from the site land in spam or promotions",
    "An email log shows messages as sent but nobody receives them",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Send test mail, read the mail log and bounce messages, and check whether your host blocks PHP mail and whether SPF, DKIM and DMARC pass." },
    { verb: "Configure", detail: "Connect WordPress to an authenticated SMTP or transactional email service and set a From address on your own domain." },
    { verb: "Repair", detail: "Add or correct SPF, DKIM and DMARC records, and fix form and WooCommerce email settings that were switched off or misaddressed." },
    { verb: "Verify", detail: "Test each contact form, password reset and WooCommerce email, and check message headers for passing authentication." },
    { verb: "Report", detail: "Document the mail settings and DNS records so future changes do not break delivery." },
  ],
  deliverables: [
    "Site email sent through authenticated SMTP from your own domain",
    "SPF, DKIM and DMARC records set up or corrected",
    "Every contact form and WooCommerce email tested end to end",
    "A written record of the mail settings and DNS changes",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why does WordPress fail to send email?", a: "WordPress uses PHP's mail function by default. Many hosts limit or block it, and mail sent that way usually lacks the authentication that Gmail and Outlook check, so it is rejected or filtered as spam." },
    { q: "Do I need an SMTP plugin?", a: "In most cases yes. An SMTP plugin sends mail through a real, authenticated mail service instead of the web server, which is what makes delivery reliable." },
    { q: "What are SPF, DKIM and DMARC?", a: "They are DNS records that tell receiving servers which services may send mail for your domain and let them verify each message. Without them, mail from your site looks forged." },
    { q: "Are form entries sent while email was broken lost?", a: "Not always. Many form plugins and WooCommerce store entries and orders in the database, so they can be viewed or exported even though the email never arrived." },
    { q: "Only WooCommerce emails are missing. Why?", a: "Each WooCommerce email can be switched off separately under WooCommerce, Settings, Emails, and some are only sent on specific order status changes. A payment plugin that skips a status can stop an email silently." },
  ],
  guideSlugs: ["wordpress-not-sending-email", "woocommerce-emails-not-sending"],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/woocommerce/fixes/", "/guides/wordpress-not-sending-email/", "/guides/woocommerce-emails-not-sending/"],
  seo: {
    title: "WordPress Not Sending Email Fix",
    description: "Contact forms, order emails or password resets not arriving? We set up authenticated SMTP and SPF, DKIM and DMARC, then test every email your site sends.",
  },
  image: { slot: "service-email-not-sending", alt: "An SMTP plugin settings screen in wp-admin next to a test email in an inbox" },
});
