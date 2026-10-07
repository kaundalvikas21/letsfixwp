import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "woocommerce-development",
  path: "/woocommerce/development/",
  hub: "woocommerce",
  intent: "project",
  title: "WooCommerce development",
  h1: "WooCommerce store development",
  heroLine: "A WooCommerce store built for selling in India, with Indian gateways, GST, shipping and the features your catalogue needs.",
  summary:
    "We build WooCommerce stores and custom store features: product setup, Indian payment gateways, GST, shipping, and the extensions your catalogue needs.",
  whoItsFor:
    "Businesses starting to sell online on WordPress, and existing WooCommerce stores that need new features or a rebuild.",
  symptoms: [],
  whatWeDo: [
    { verb: "Plan", detail: "Agree the catalogue structure, product types, payment methods, shipping rules and tax setup before building." },
    { verb: "Build", detail: "Build the store theme, product pages, cart and checkout, using WooCommerce blocks where they fit." },
    { verb: "Integrate", detail: "Connect payment gateways, courier and shipping services, GST invoicing and any ERP or inventory system." },
    { verb: "Test", detail: "Place test orders through every payment and shipping method and check order emails and invoices." },
    { verb: "Launch", detail: "Switch gateways to live mode, place a real order, and train your team on handling orders and stock." },
  ],
  deliverables: [
    "A working WooCommerce store on your domain",
    "Payment gateways set up and tested in live mode",
    "Shipping zones, rates and tax settings configured",
    "Product import from your spreadsheet or old store",
    "Order and stock management training for your team",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "WooCommerce or Shopify?", a: "WooCommerce gives full control of the code, data and hosting with no platform transaction fees. Shopify is hosted and simpler to run. Our comparison page sets out the trade-offs." },
    { q: "Which payment gateways can you set up?", a: "Razorpay, PayU, Cashfree, PhonePe, CCAvenue, Stripe, PayPal and others with a WooCommerce plugin, including UPI, cards, netbanking and wallets where the gateway supports them." },
    { q: "Can you import my existing products?", a: "Yes, from a CSV or spreadsheet, or directly from another platform, including variations, images and stock levels." },
    { q: "Can you set up GST on the store?", a: "Yes. We configure tax classes, state-based rates and GST invoices to match what your accountant specifies. We do not give tax advice." },
    { q: "Can you add custom features?", a: "Yes. Custom product options, B2B pricing, checkout fields and integrations are built as plugins so they survive theme changes." },
  ],
  guideSlugs: [],
  relatedPaths: ["/compare/woocommerce-vs-shopify/", "/woocommerce/payment-gateway-gst/", "/wordpress-maintenance/woocommerce/"],
  seo: {
    title: "WooCommerce Development: Stores and Custom Features",
    description: "WooCommerce store development with Indian payment gateways, GST, shipping and custom features, tested with real orders before launch.",
  },
  image: { slot: "service-woocommerce-development", alt: "WooCommerce product edit screen with price, stock and variation settings" },
});
