import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "maintenance-woocommerce",
  path: "/wordpress-maintenance/woocommerce/",
  hub: "wordpress-maintenance",
  intent: "plan",
  title: "WooCommerce maintenance",
  h1: "WooCommerce maintenance for stores that cannot afford a broken checkout",
  summary:
    "Ongoing care for WooCommerce stores: updates tested against your checkout and payment gateways, backups that never lose orders, and monitoring of the parts that take money.",
  whoItsFor:
    "Store owners who sell through WooCommerce and need updates and fixes handled without risking orders, payments or stock data.",
  symptoms: [],
  whatWeDo: [
    { verb: "Test", detail: "Apply WooCommerce, extension and gateway updates on a staging copy first and place test orders before anything reaches the live store." },
    { verb: "Back up", detail: "Take database backups often enough that recent orders are covered, and restore the store without overwriting newer orders." },
    { verb: "Monitor", detail: "Watch uptime, checkout errors, failed payment webhooks and WooCommerce logs so a broken checkout is noticed quickly." },
    { verb: "Update", detail: "Keep template overrides in your theme in step with WooCommerce so outdated templates do not quietly break pages." },
    { verb: "Report", detail: "Send a regular report of updates, test orders placed, errors found and anything that needs your decision." },
  ],
  deliverables: [
    "Staged and tested updates for WooCommerce, extensions and payment gateways",
    "Order-safe database backups stored off your hosting server",
    "Checkout, webhook and uptime monitoring with alerts acted on by us",
    "Template override checks after each WooCommerce release",
    "A regular maintenance report covering the store",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Why is WooCommerce maintenance different from a normal care plan?", a: "A store changes every time someone orders, so a backup restore can wipe out real orders. Updates can also break checkout or a payment gateway. We test orders after updates and handle restores so order data is kept." },
    { q: "Do you update on the live store?", a: "Major WooCommerce and gateway updates go to a staging copy first. Once test orders pass there, we apply the same updates to the live store and test again." },
    { q: "Which payment gateways do you work with?", a: "Any gateway with a WooCommerce plugin, including Razorpay, PayU, Cashfree, PhonePe, CCAvenue, Stripe and PayPal." },
    { q: "Will you need to take the store offline?", a: "Normally no. Routine updates and backups run while the store stays open. If a large change needs a short maintenance window, we agree the time with you first." },
    { q: "Where can I see plan prices?", a: "The pricing page lists the current plans and what each includes." },
  ],
  guideSlugs: [],
  relatedPaths: ["/woocommerce/fixes/", "/wordpress-maintenance/care-plans/", "/woocommerce/payment-gateway-gst/", "/pricing/"],
  seo: {
    title: "WooCommerce Maintenance: Tested Updates and Backups",
    description: "WooCommerce maintenance with updates tested on staging, order-safe backups and checkout monitoring, so updates do not break the way you take payments.",
  },
  image: { slot: "service-maintenance-woocommerce", alt: "WooCommerce Status screen showing outdated template overrides and system information" },
});
