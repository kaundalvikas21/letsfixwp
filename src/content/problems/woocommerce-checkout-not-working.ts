import { problemSchema } from "../schema";

export default problemSchema.parse({
  slug: "woocommerce-checkout-not-working",
  category: "woocommerce",
  title: "WooCommerce checkout not working",
  h1: "Fix a WooCommerce checkout that is not working",
  symptoms: [
    "The \"Place order\" button spins and nothing happens, or the page simply reloads",
    "Customers see \"There was an error processing your order. Please check for any charges in your payment method and review your order history before placing the order again.\"",
    "The checkout redirects back to the cart or shows \"Sorry, your session has expired.\"",
    "Payments appear in Stripe or PayPal but no matching order is created, or orders sit at \"Pending payment\"",
    "The checkout page is blank, missing fields or missing the payment options",
  ],
  likelyCauses: [
    "A JavaScript error from a plugin or theme stopping the checkout script from submitting",
    "A caching or optimization layer caching the cart or checkout page and breaking the customer's session",
    "Payment gateway settings, API keys or webhooks that are wrong or have expired",
    "Outdated WooCommerce template overrides in the theme that no longer match the current WooCommerce version",
    "Extensions that do not support the block based Checkout, or a mix of block and classic checkout settings",
  ],
  ourFix: [
    { verb: "Diagnose", detail: "Place test orders, read WooCommerce > Status > Logs and the browser console and find the exact step where checkout fails." },
    { verb: "Back up", detail: "Copy files and database, including all orders, without taking the store offline." },
    { verb: "Repair", detail: "Fix the conflicting plugin or template, exclude cart and checkout from caching and correct the gateway configuration." },
    { verb: "Verify", detail: "Complete test orders with each payment method in test mode and confirm order emails and stock updates go through." },
    { verb: "Harden", detail: "Tell you which plugins and templates to watch on future updates and how to test checkout after each one." },
  ],
  safeChecks: [
    "Open WooCommerce > Status in wp-admin and scroll to the Templates section. Note any warning about outdated template overrides.",
    "Try a checkout in a private window and take a screenshot of the exact error message, along with the time it happened.",
  ],
  urgency: "critical",
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Am I losing sales right now?", a: "Very likely, if customers cannot complete payment. Until it is fixed, a short notice on the site with another way to order, such as phone or email, can save some of those sales." },
    { q: "Were customers charged for orders that failed?", a: "Sometimes. Compare recent payments in your Stripe or PayPal dashboard with your WooCommerce orders. Any payment without an order needs following up, and we can help match them." },
    { q: "Did a WooCommerce update cause this?", a: "It is a common trigger, especially when the theme overrides checkout templates or an extension has not caught up. The fix is to bring those parts in line rather than stay on an old WooCommerce version." },
    { q: "Do you need to take the store offline?", a: "Usually not. Where possible we reproduce the problem on a staging copy first and apply the fix to the live store once it is tested." },
  ],
  relatedSlugs: ["payment-gateway-errors", "woocommerce-emails-not-sending", "plugin-conflict", "site-down-after-update"],
  seo: {
    title: "WooCommerce Checkout Not Working? | FixMyWP",
    description: "Customers stuck at checkout or seeing an error processing their order? We find the plugin, cache or gateway fault and get WooCommerce taking orders.",
  },
  image: { slot: "illustration-woocommerce-checkout-not-working", alt: "A checkout page with a spinning Place order button and an error banner above the form" },
});
