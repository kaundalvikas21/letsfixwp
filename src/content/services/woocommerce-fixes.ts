import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "woocommerce-fixes",
  path: "/woocommerce/fixes/",
  hub: "woocommerce",
  intent: "fix",
  title: "WooCommerce not working",
  h1: "Fix WooCommerce checkout, payment and order problems",
  heroLine: "Checkout broken, payments failing or orders not coming through. We find the fault and get your store selling again.",
  summary:
    "When customers cannot check out, payments fail or orders go missing, we find the plugin, gateway or caching fault behind it and get the store taking orders again.",
  whoItsFor:
    "WooCommerce store owners losing sales to a broken checkout, failing payment gateway or orders that do not come through.",
  symptoms: [
    "The Place order button spins and nothing happens, or the page reloads",
    "Payments show in Razorpay, PayU, Stripe or PayPal, but the order stays at Pending payment or Failed",
    "The checkout page is blank, missing fields or missing payment options",
    "Customers are sent back to the cart or see a session expired message",
    "Order confirmation emails stop reaching customers or the store owner",
  ],
  whatWeDo: [
    { verb: "Diagnose", detail: "Place test orders, read WooCommerce logs and the browser console, and find the exact step where checkout fails." },
    { verb: "Back up", detail: "Copy files and database, including all orders, without taking the store offline." },
    { verb: "Repair", detail: "Fix the conflicting plugin or template, exclude cart and checkout from caching, and correct gateway keys and webhooks." },
    { verb: "Test", detail: "Run orders through each payment method and confirm they reach Processing and send their emails." },
    { verb: "Report", detail: "Explain the cause, what we changed and what to check before future updates." },
  ],
  deliverables: [
    "A working checkout confirmed with test orders",
    "Corrected payment gateway keys and webhook endpoints",
    "Cart and checkout excluded from page caching",
    "A written note of the cause and the fix",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "A customer paid but there is no order. What should I do?", a: "Do not ask them to pay again. Match the payment in your gateway dashboard to the customer, then create the order manually or refund. We fix the webhook so it stops happening." },
    { q: "Is it the customer's bank or my store?", a: "One declined payment is usually the bank. Many failures in a short period point to the store or gateway settings. The failure reason in your gateway dashboard tells them apart." },
    { q: "Will you take my store offline to fix it?", a: "Usually not. We diagnose on the live store using logs and test orders, and make larger changes on a staging copy first." },
    { q: "Will you see my customers' card details?", a: "No. Standard gateway integrations send card and UPI details straight to the payment provider, so full card numbers are never stored on your WordPress site." },
    { q: "Why did checkout break after an update?", a: "Common causes are outdated template overrides in the theme, an extension not compatible with the block checkout, or a caching plugin that started caching checkout pages." },
  ],
  guideSlugs: ["woocommerce-checkout-not-working", "payment-gateway-errors"],
  relatedPaths: [
    "/guides/woocommerce-checkout-not-working/",
    "/guides/payment-gateway-errors/",
    "/woocommerce/payment-gateway-gst/",
    "/wordpress-maintenance/woocommerce/",
  ],
  seo: {
    title: "WooCommerce Checkout and Payment Problems Fixed",
    description: "WooCommerce checkout broken, payments failing or orders stuck at pending? We trace the plugin, gateway or caching fault and get orders coming in.",
  },
  image: { slot: "service-woocommerce-fixes", photo: "store", alt: "WooCommerce checkout page with a red error notice above the Place order button" },
});
