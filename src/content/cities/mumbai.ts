import { citySchema } from "../schema";

export default citySchema.parse({
  slug: "mumbai",
  city: "Mumbai",
  priority: 7,
  localContext: [
    "Mumbai is India's financial centre, and financial firms here, from stockbrokers and wealth managers to NBFCs, insurance distributors and SEBI-registered advisers, run websites that carry a lot of required information: registration numbers, disclosures, investor charters, grievance contacts and downloadable policies. We build WordPress sites where these sections are structured content the compliance team can update, rather than PDFs scattered across pages.",
    "Media, entertainment and publishing businesses, from production houses to digital publishers and agencies, care about showreels, galleries, embedded video and article archives that stay fast as they grow. That means careful image and video handling, caching, and a theme that loads only the scripts each page needs.",
    "The city is also home to many retail and D2C brands in fashion, beauty, food and home goods. Their WooCommerce stores have to handle UPI and card payments through Indian gateways, cash on delivery rules, GST invoices and shipping aggregator integrations, and keep checkout responsive on sale days.",
    "Marathi and Hindi versions are worth adding for brands and services that sell to a broad local audience. We are not based in Mumbai and work remotely, with reviews and handovers on video call.",
  ],
  servicesHighlighted: ["woocommerce-development", "payment-gateway-gst", "speed-optimization", "redesign"],
  faqs: [
    {
      q: "Can you build a disclosures section for a SEBI-registered firm?",
      a: "Yes. We build a structured section for registration details, disclosures, investor charters and grievance contacts using the content your compliance team provides. We do not advise on what you are required to publish.",
    },
    {
      q: "Can our D2C store offer cash on delivery only for some pin codes?",
      a: "Yes. Cash on delivery can be limited by pin code, order value or product using WooCommerce settings and a suitable plugin, and a COD fee can be added if you charge one.",
    },
    {
      q: "Our store slows down during sales. What can you do?",
      a: "We look at hosting, caching rules for cart and checkout, slow database queries and heavy plugins, fix what we find, and test checkout under load before a planned sale where the hosting allows it.",
    },
    {
      q: "Can you add Marathi or Hindi pages?",
      a: "Yes. Each language gets its own URLs and menus. Product pages, policies and checkout labels can all be translated, and we check Devanagari text on phones.",
    },
  ],
  seo: {
    title: "WordPress Development in Mumbai",
    description: "WordPress and WooCommerce for Mumbai finance firms, media businesses and D2C brands: disclosure pages, Indian gateways, GST invoices and speed work.",
  },
});
