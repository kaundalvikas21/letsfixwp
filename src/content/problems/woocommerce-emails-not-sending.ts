import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "woocommerce-emails-not-sending",
  category: "woocommerce",
  title: "WooCommerce emails not sending",
  h1: "Fix WooCommerce emails that are not sending",
  symptoms: [
    "Customers say they never received their order confirmation",
    "You no longer get the \"New order\" notification when someone buys",
    "Order emails land in spam, while some other site emails arrive normally",
    "An SMTP plugin log shows \"SMTP Error: Could not authenticate.\" or a connection failure",
  ],
  likelyCauses: [
    "The site sends through the host's PHP mail() function, which is blocked, rate limited or rejected by inbox providers",
    "Missing or wrong SPF, DKIM and DMARC records for your domain, which Gmail and Yahoo now require from bulk senders",
    "An email type switched off, or the wrong recipient address, under WooCommerce > Settings > Emails",
    "Orders stuck at \"Pending payment\" or \"On hold\", which do not trigger the same emails as \"Processing\"",
    "A changed SMTP password, or an email account that now requires an app password or OAuth",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Send test emails, read the mail logs and check which order statuses and email types are failing." },
    { verb: "Back up", detail: "Copy files and database, including orders, before changing any settings." },
    { verb: "Repair", detail: "Route mail through an authenticated SMTP or transactional email service, fix the WooCommerce email settings and correct order status problems." },
    { verb: "Verify", detail: "Place test orders and confirm the customer and admin emails arrive in the inbox, not spam." },
    { verb: "Harden", detail: "Set up SPF, DKIM and DMARC with your domain provider and turn on email logging so failures are visible." },
  ],
  safeChecks: [
    "Open WooCommerce > Settings > Emails and check each email you rely on is enabled. Note the recipient listed for New order.",
    "Check the spam folder of the address that should receive New order emails, and note the order number and time of a missing email.",
  ],
  urgency: "high",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Are my orders still coming in?", a: "Usually yes. Missing emails rarely stop orders being created. Check WooCommerce > Orders to see recent orders while the email problem is fixed." },
    { q: "Why do some emails send and others do not?", a: "Each WooCommerce email is triggered by a specific order status change. If orders stall at one status, or a single email type is disabled, only those emails go missing." },
    { q: "Do I need an SMTP plugin?", a: "For a store, yes in practice. Authenticated sending through your email provider or a transactional service is far more reliable than the default PHP mail() most hosts provide." },
    { q: "Can I resend emails customers missed?", a: "Yes. On each order screen, the Order actions box lets you resend the order details or the processing order email to the customer." },
  ],
  relatedSlugs: ["wordpress-not-sending-email", "woocommerce-checkout-not-working", "payment-gateway-errors"],
  seo: {
    title: "WooCommerce Emails Not Sending? | FixMyWP",
    description: "Order confirmations or new order alerts missing? We fix WooCommerce email settings, SMTP and SPF, DKIM and DMARC so store emails reach the inbox.",
  },
  image: { slot: "illustration-woocommerce-emails-not-sending", alt: "An order confirmation envelope stuck halfway between a shop and an email inbox" },
});
