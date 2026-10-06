import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "payment-gateway-errors",
  title: "WooCommerce payment gateway not working",
  h1: "Fix WooCommerce payment gateway errors",
  errorText: "Your card was declined.",
  symptoms: [
    "Customers with valid cards see \"Your card was declined.\" from Stripe",
    "PayPal shows \"Things don't appear to be working at the moment. Please try again later.\"",
    "A gateway such as Razorpay, PayU, Cashfree, PhonePe, CCAvenue, Stripe or PayPal is missing from the checkout page",
    "The customer pays by card or UPI on the gateway's page but is not returned to the order confirmation page",
    "The payment succeeds in the gateway dashboard but the WooCommerce order stays at \"Pending payment\" or \"Failed\"",
  ],
  likelyCauses: [
    "API keys or merchant credentials that are wrong, revoked or still in test mode on the live store, or a gateway account that is restricted or not yet activated",
    "Webhooks failing because the signing secret is wrong or a firewall or security plugin blocks the callback",
    "A domain or SSL change after a migration that breaks the gateway's return and callback URLs, or a new domain not yet approved in the gateway account",
    "A JavaScript conflict stopping the card field, the payment popup or the 3D Secure or OTP window from loading",
    "An outdated gateway plugin, or a currency or country the gateway account is not set up for",
  ],
  safeChecks: [
    "Log in to your gateway dashboard, such as Razorpay, PayU, Cashfree, PhonePe, CCAvenue, Stripe or PayPal, and look at recent failed payments. Note the reason shown next to each.",
    "In WooCommerce > Settings > Payments, check that the gateway is enabled and whether it is set to test or sandbox mode.",
  ],
  whenToCallUs:
    "If many customers fail in a short period, or payments show in the gateway dashboard without matching orders, the fault is on the site or in the account settings rather than with one bank. Changing keys, webhooks or firewall rules on a live store can stop every payment method at once. Call us then, and do not ask customers to pay again while it is fixed.",
  parentService: "woocommerce-fixes",
  urgency: "critical",
  faqs: [
    { q: "Is it the customer's bank or my site?", a: "One declined card is usually the bank. Many customers failing in a short period points to the site or the account settings. The failure reason in your gateway dashboard tells the two apart." },
    { q: "A customer paid but there is no order. What should I do?", a: "Do not ask them to pay again. Match the payment in your gateway dashboard to the customer, then create the order manually or refund. We fix the webhook or callback so it stops happening." },
    { q: "Do you need my gateway login?", a: "We prefer not to use your own login. Gateways such as Razorpay and Stripe let you invite a team member with limited permissions, and many fixes only need WordPress and hosting access." },
    { q: "Will you see my customers' card numbers?", a: "No. Standard integrations from gateways such as Razorpay, PayU, Stripe and PayPal send card details straight to the payment provider, so full card numbers are never stored on your WordPress site." },
  ],
  seo: {
    title: "WooCommerce Payment Gateway Errors Fixed",
    description: "Razorpay, PayU, Stripe or PayPal failing, or orders stuck at pending? We trace the gateway, webhook or plugin fault and get payments working again.",
  },
  image: { slot: "illustration-payment-gateway-errors", alt: "A payment form with a card declined message and a red warning icon" },
});
