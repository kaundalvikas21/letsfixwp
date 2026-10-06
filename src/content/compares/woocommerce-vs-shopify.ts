import { compareSchema } from "../schema";

export default compareSchema.parse({
  slug: "woocommerce-vs-shopify",
  a: "WooCommerce",
  b: "Shopify",
  rows: [
    {
      criterion: "Ownership and hosting",
      a: "A free, open-source plugin for WordPress. You choose the host and hold the store's data and code.",
      b: "A hosted service. Shopify runs the infrastructure and you use the store under its terms.",
    },
    {
      criterion: "Cost structure",
      a: "No platform subscription. Costs come from hosting, paid extensions, themes and development work.",
      b: "A monthly subscription by plan tier, plus paid apps and themes as needed.",
    },
    {
      criterion: "Transaction fees",
      a: "WooCommerce adds no platform transaction fee. You pay only your payment gateway's charges.",
      b: "Gateway charges apply, and Shopify adds its own transaction fee when you use a third-party gateway instead of Shopify Payments. Check whether Shopify Payments is available for your store's country.",
    },
    {
      criterion: "Indian payment gateways",
      a: "Plugins for Razorpay, PayU, Cashfree, CCAvenue, PhonePe and others, covering UPI, cards, net banking and wallets.",
      b: "Razorpay, PayU, Cashfree and other Indian providers connect as third-party payment providers.",
    },
    {
      criterion: "GST invoicing",
      a: "GST rates are set in WooCommerce. Invoices showing GSTIN, HSN codes and the CGST, SGST or IGST split come from invoice plugins.",
      b: "Tax settings support Indian GST. GST invoices are usually produced through apps from the Shopify App Store.",
    },
    {
      criterion: "Flexibility and extensions",
      a: "Full code access. Checkout, product types, pricing rules and integrations can be changed at any level.",
      b: "A large app ecosystem and theme customisation. Deeper changes to checkout and core behaviour depend on the plan and the platform's APIs.",
    },
    {
      criterion: "SEO control",
      a: "Full control of URLs, structured data, redirects and server performance.",
      b: "Good built-in SEO basics, but URLs use fixed prefixes such as /products/ and /collections/, and server settings are managed by Shopify.",
    },
    {
      criterion: "Maintenance burden",
      a: "You or a provider handle hosting, updates, backups, security and performance.",
      b: "Shopify handles hosting, security patches, uptime and PCI compliance for its checkout.",
    },
    {
      criterion: "Traffic spikes on sale days",
      a: "Depends on your hosting and caching setup, so large sales need planning in advance.",
      b: "Shopify's infrastructure absorbs traffic spikes without you managing servers.",
    },
    {
      criterion: "Portability",
      a: "Files and database can move to any host, and products, customers and orders can be exported.",
      b: "Products, customers and orders export as CSV, but themes and app features do not carry over to another platform.",
    },
  ],
  verdictByScenario: [
    {
      scenario: "A first store with a small catalogue and no developer",
      verdict: "Shopify is quicker to run alone. Hosting, security and checkout are handled for you.",
    },
    {
      scenario: "A content-led brand that already has a WordPress site with traffic",
      verdict: "WooCommerce keeps the store, blog and SEO on one site you already control.",
    },
    {
      scenario: "B2B wholesale pricing, custom product options or unusual checkout rules",
      verdict: "WooCommerce allows changes at the code level that are harder or impossible on Shopify.",
    },
    {
      scenario: "Large sale-day spikes and no wish to manage servers",
      verdict: "Shopify handles the load at the platform level. WooCommerce can cope too, but needs suitable hosting and caching.",
    },
    {
      scenario: "You want to keep per-order platform charges low while using an Indian gateway",
      verdict: "WooCommerce adds no platform transaction fee. On Shopify, the extra fee for third-party gateways applies unless Shopify Payments is available to you, though hosting costs on WooCommerce should be counted too.",
    },
  ],
  seo: {
    title: "WooCommerce vs Shopify for Indian Stores",
    description: "WooCommerce vs Shopify compared on ownership, transaction fees, Indian payment gateways, GST invoicing, SEO and maintenance, with verdicts.",
  },
});
