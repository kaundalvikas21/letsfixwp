import { citySchema } from "../schema";

export default citySchema.parse({
  slug: "ahmedabad",
  city: "Ahmedabad",
  priority: 4,
  localContext: [
    "Ahmedabad's textile trade, from spinners and weavers to processors of dyed and printed fabric and garment exporters, still runs heavily on personal relationships and WhatsApp. A website for these businesses works best as a structured catalogue: fabric types, GSM, composition, finishes and minimum order quantities, with an enquiry button on every product. We build that on WordPress so the sales team can add a new collection without a developer.",
    "Pharmaceutical and chemical companies in industrial estates such as Vatva, Naroda and Changodar need sites that speak to regulators, distributors and overseas buyers at the same time. That usually means product lists by molecule or CAS number, quality and certification pages, downloadable documents, and separate enquiry routes for domestic and export sales.",
    "Diamond and jewellery traders and other exporters from across Gujarat often want a B2B catalogue that hides prices from the public and shows them only to approved buyers. Retail and D2C brands from the city want the opposite: a WooCommerce store with Indian payment gateways, GST invoices and shipping integrations.",
    "Gujarati content matters for many of these businesses, whether the readers are local dealers or decision makers in family-run firms who prefer it. We set up Gujarati and English versions with separate URLs and check font rendering on phones. Our work with Ahmedabad businesses is remote, with meetings on video call.",
  ],
  remoteDelivery:
    "Being on the same IST clock, we set video calls for whenever suits you, between dealer meetings or after the day's dispatches are done. At handover we pass on all logins and hosting details, a written guide to adding fabrics or products to the catalogue in English and Gujarati, and a recorded walkthrough your sales staff can return to.",
  servicesHighlighted: ["woocommerce-development", "payment-gateway-gst", "custom-plugin", "website-design"],
  faqs: [
    {
      q: "Can you build our site in Gujarati and English?",
      a: "Yes. Each language gets its own URLs, menus and SEO titles, so Gujarati pages can appear in search on their own. Your team or a translator you pick supplies the Gujarati copy.",
    },
    {
      q: "Can only approved dealers see our prices?",
      a: "Yes. We set up a wholesale role so approved, logged-in buyers see prices and order quantities, while visitors see an enquiry button instead.",
    },
    {
      q: "Which payment gateways can you connect to a WooCommerce store?",
      a: "We commonly work with Razorpay, PayU, Cashfree, CCAvenue and PhonePe through their WooCommerce plugins, and test UPI, card and net banking payments in each gateway's test mode before going live.",
    },
    {
      q: "Can the store produce GST invoices?",
      a: "Yes. We configure GST rates per product and add an invoice plugin that prints your GSTIN, HSN codes and the CGST, SGST or IGST split based on where the customer is.",
    },
  ],
  seo: {
    title: "WordPress Development in Ahmedabad",
    description: "WordPress and WooCommerce for Ahmedabad textile, pharma and export firms: catalogues, dealer pricing, GST invoices and Gujarati pages.",
  },
});
