import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "woocommerce-emails-not-sending",
  title: "WooCommerce emails not sending",
  h1: "Fix WooCommerce emails that are not sending",
  errorText: "SMTP Error: Could not authenticate.",
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
  safeChecks: [
    "Open WooCommerce > Settings > Emails and check each email you rely on is enabled. Note the recipient listed for New order.",
    "Check the spam folder of the address that should receive New order emails, and note the order number and time of a missing email.",
  ],
  whenToCallUs:
    "If the emails are enabled in WooCommerce and still not arriving, the fault is in mail sending, DNS or order statuses rather than a simple setting. Changing SMTP details or DNS records on a live store can stop every order email at once. Call us before you change those, and resend missed emails from each order screen in the meantime.",
  parentService: "email-not-sending",
  urgency: "high",
  faqs: [
    { q: "Are my orders still coming in?", a: "Usually yes. Missing emails rarely stop orders being created. Check WooCommerce > Orders to see recent orders while the email problem is fixed." },
    { q: "Why do some emails send and others do not?", a: "Each WooCommerce email is triggered by a specific order status change. If orders stall at one status, or a single email type is disabled, only those emails go missing." },
    { q: "Do I need an SMTP plugin?", a: "For a store, yes in practice. Authenticated sending through your email provider or a transactional service is far more reliable than the default PHP mail() most hosts provide." },
    { q: "Can I resend emails customers missed?", a: "Yes. On each order screen, the Order actions box lets you resend the order details or the processing order email to the customer." },
  ],
  seo: {
    title: "WooCommerce Emails Not Sending?",
    description: "Order confirmations or new order alerts missing? We fix WooCommerce email settings, SMTP and SPF, DKIM and DMARC so store emails reach the inbox.",
  },
  image: { slot: "illustration-woocommerce-emails-not-sending", alt: "An order confirmation envelope stuck halfway between a shop and an email inbox" },
});
