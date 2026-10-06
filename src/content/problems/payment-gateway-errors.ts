import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "payment-gateway-errors",
  category: "woocommerce",
  title: "WooCommerce payment gateway not working",
  h1: "Fix WooCommerce payment gateway errors",
  symptoms: [
    "Customers with valid cards see \"Your card was declined.\" from Stripe",
    "PayPal shows \"Things don't appear to be working at the moment. Please try again later.\"",
    "The Stripe or PayPal option is missing from the checkout page",
    "The payment succeeds in Stripe or PayPal but the WooCommerce order stays at \"Pending payment\" or \"Failed\"",
  ],
  likelyCauses: [
    "API keys that are wrong, revoked or still set to test mode on the live store, or a restricted payment account",
    "Webhooks failing because the signing secret is wrong or a firewall or security plugin blocks the callback",
    "A domain or SSL change after a migration that breaks the gateway's return and callback URLs",
    "A JavaScript conflict stopping the card field or the 3D Secure authentication window from loading",
    "An outdated gateway plugin, or a currency or country the gateway account is not set up for",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Turn on gateway debug logging, read WooCommerce > Status > Logs and check the event and webhook delivery history in your Stripe or PayPal dashboard." },
    { verb: "Back up", detail: "Copy files and database, including orders, before changing any payment settings." },
    { verb: "Repair", detail: "Correct the keys and webhook endpoints, fix the conflicting script or firewall rule and update the gateway plugin." },
    { verb: "Verify", detail: "Run test transactions through each payment method and confirm orders move to Processing and send their emails." },
    { verb: "Harden", detail: "Set up webhook failure alerts in the payment dashboard and document which settings must change if the domain ever moves." },
  ],
  safeChecks: [
    "Log in to your Stripe or PayPal dashboard and look at recent failed or declined payments. Note the reason shown next to each.",
    "In WooCommerce > Settings > Payments, check that the gateway is enabled and whether it is set to test or sandbox mode.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Is it the customer's bank or my site?", a: "One declined card is usually the bank. Many customers failing in a short period points to the site or the account settings. The decline reason in your Stripe or PayPal dashboard tells the two apart." },
    { q: "A customer paid but there is no order. What should I do?", a: "Do not ask them to pay again. Match the payment in your gateway dashboard to the customer, then create the order manually or refund. We fix the webhook so it stops happening." },
    { q: "Do you need my Stripe or PayPal login?", a: "We prefer not to use your own login. Stripe lets you invite a team member with limited permissions, and many fixes only need WordPress and hosting access." },
    { q: "Will you see my customers' card numbers?", a: "No. Standard Stripe and PayPal integrations send card details straight to the payment provider, so full card numbers are never stored on your WordPress site." },
  ],
  relatedSlugs: ["woocommerce-checkout-not-working", "mixed-content-ssl-errors", "plugin-conflict", "woocommerce-emails-not-sending"],
  seo: {
    title: "WooCommerce Payment Gateway Errors Fixed | FixMyWP",
    description: "Stripe or PayPal declining payments or orders stuck at pending? We trace the gateway, webhook or plugin fault and get WooCommerce payments working again.",
  },
  image: { slot: "illustration-payment-gateway-errors", alt: "A payment form with a card declined message and a red warning icon" },
});
