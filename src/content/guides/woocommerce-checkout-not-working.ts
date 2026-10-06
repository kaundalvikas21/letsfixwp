import { guideSchema } from "../schema";

export default guideSchema.parse({
  slug: "woocommerce-checkout-not-working",
  title: "WooCommerce checkout not working",
  h1: "Fix a WooCommerce checkout that is not working",
  errorText:
    "There was an error processing your order. Please check for any charges in your payment method and review your order history before placing the order again.",
  symptoms: [
    "The \"Place order\" button spins and nothing happens, or the page simply reloads",
    "Customers see \"There was an error processing your order. Please check for any charges in your payment method and review your order history before placing the order again.\"",
    "The checkout redirects back to the cart or shows \"Sorry, your session has expired.\"",
    "Payments appear in your Razorpay, PayU, Stripe or PayPal dashboard but no matching order is created, or orders sit at \"Pending payment\"",
    "The checkout page is blank, missing fields or missing the payment options",
  ],
  likelyCauses: [
    "A JavaScript error from a plugin or theme stopping the checkout script from submitting",
    "A caching or optimization layer caching the cart or checkout page and breaking the customer's session",
    "Payment gateway settings, API keys or webhooks that are wrong or have expired",
    "Outdated WooCommerce template overrides in the theme that no longer match the current WooCommerce version",
    "Extensions that do not support the block based Checkout, or a mix of block and classic checkout settings",
  ],
  safeChecks: [
    "Open WooCommerce > Status in wp-admin and scroll to the Templates section. Note any warning about outdated template overrides.",
    "Try a checkout in a private window and take a screenshot of the exact error message, along with the time it happened.",
  ],
  whenToCallUs:
    "If checkout still fails in a private window, or WooCommerce > Status warns about outdated templates, the store is losing orders until the cause is found. Turning plugins off one by one on a live store can break orders in progress and payment callbacks. Call us at that point, and we reproduce the fault on a staging copy where we can.",
  parentService: "woocommerce-fixes",
  urgency: "critical",
  faqs: [
    { q: "Am I losing sales right now?", a: "Very likely, if customers cannot complete payment. Until it is fixed, a short notice on the site with another way to order, such as phone or email, can save some of those sales." },
    { q: "Were customers charged for orders that failed?", a: "Sometimes. Compare recent payments in your gateway dashboard, such as Razorpay, PayU, Cashfree, Stripe or PayPal, with your WooCommerce orders. Any payment without an order needs following up, and we can help match them." },
    { q: "Did a WooCommerce update cause this?", a: "It is a common trigger, especially when the theme overrides checkout templates or an extension has not caught up. The fix is to bring those parts in line rather than stay on an old WooCommerce version." },
    { q: "Do you need to take the store offline?", a: "Usually not. Where possible we reproduce the problem on a staging copy first and apply the fix to the live store once it is tested." },
  ],
  seo: {
    title: "WooCommerce Checkout Not Working?",
    description: "Customers stuck at checkout or seeing an error processing their order? We find the plugin, cache or gateway fault and get WooCommerce taking orders.",
  },
  image: { slot: "illustration-woocommerce-checkout-not-working", alt: "A checkout page with a spinning Place order button and an error banner above the form" },
});
