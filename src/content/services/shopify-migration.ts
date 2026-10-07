import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "shopify-migration",
  path: "/woocommerce/shopify-migration/",
  hub: "woocommerce",
  intent: "project",
  title: "Shopify to WooCommerce migration",
  h1: "Move your store from Shopify to WooCommerce",
  heroLine: "Leave Shopify for a WooCommerce store you control, with products, customers, orders and old URLs carried across.",
  summary:
    "We move your products, variants, customers, orders and content from Shopify to WooCommerce, and redirect every old Shopify URL so search traffic follows.",
  whoItsFor:
    "Shopify store owners who want lower platform fees, full control of their data, or WooCommerce features Shopify does not allow.",
  symptoms: [],
  whatWeDo: [
    { verb: "Audit", detail: "List your products, variants, collections, customers, orders, apps and pages, and note what each Shopify app does." },
    { verb: "Plan", detail: "Choose WooCommerce plugins to replace your Shopify apps and map every Shopify URL to its new address." },
    { verb: "Migrate", detail: "Import products with variants and images, customers, order history, pages and blog posts into WooCommerce." },
    { verb: "Test", detail: "Compare product counts, prices and stock against Shopify and place test orders through each payment method." },
    { verb: "Launch", detail: "Add 301 redirects from Shopify paths such as /products/ and /collections/, switch the domain and check Search Console." },
  ],
  deliverables: [
    "Products, variants, images and stock levels in WooCommerce",
    "Customer accounts and order history carried across",
    "301 redirects from every Shopify product, collection and page URL",
    "Payment gateways and shipping rates set up and tested",
    "A list of Shopify apps and the WooCommerce plugins that replace them",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Will customers need to reset their passwords?", a: "Yes. Shopify does not export customer passwords, so customer accounts move across and customers set a new password on first login. We can send them a reset email at launch." },
    { q: "Will I lose my Google rankings?", a: "Shopify uses paths like /products/name and /collections/name. We redirect each one with a 301 to the matching WooCommerce page, which preserves rankings when mapped page to page." },
    { q: "Can my order history come across?", a: "Yes. Past orders, with customers, line items and totals, are imported so you keep a full record in WooCommerce." },
    { q: "What replaces my Shopify apps?", a: "Most Shopify apps have WooCommerce plugin equivalents, and some features are built into WooCommerce. We list each app and its replacement before migrating." },
    { q: "Do I keep selling during the move?", a: "Yes. Shopify stays live while we build and test WooCommerce. Just before launch, we bring across any orders and customers added since the first import." },
  ],
  guideSlugs: [],
  relatedPaths: ["/compare/woocommerce-vs-shopify/", "/woocommerce/development/", "/woocommerce/payment-gateway-gst/"],
  seo: {
    title: "Shopify to WooCommerce Migration",
    description: "Move products, variants, customers and orders from Shopify to WooCommerce, with 301 redirects from every Shopify URL and payments tested before launch.",
  },
  image: { slot: "service-shopify-migration", photo: "store", alt: "Shopify product export CSV beside the WooCommerce product import screen" },
});
