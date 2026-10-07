import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "payment-gateway-gst",
  path: "/woocommerce/payment-gateway-gst/",
  hub: "woocommerce",
  intent: "project",
  title: "Razorpay WooCommerce integration and GST setup",
  h1: "Indian payment gateways and GST setup for WooCommerce",
  heroLine: "UPI, cards and netbanking through an Indian gateway, with GST charged and invoiced the way your accountant needs.",
  summary:
    "We connect Razorpay, PayU, Cashfree, PhonePe or CCAvenue to your WooCommerce store and configure GST tax classes, state-based CGST, SGST and IGST, and GST invoices as your accountant specifies.",
  whoItsFor:
    "Indian WooCommerce stores that need to accept UPI, cards and netbanking, and charge and invoice GST correctly.",
  symptoms: [],
  whatWeDo: [
    { verb: "Plan", detail: "Confirm your gateway account, GST registration state and the rates your accountant has set for each product." },
    { verb: "Integrate", detail: "Install and configure the official WooCommerce plugin for your gateway, with webhooks for payment status." },
    { verb: "Configure", detail: "Create tax classes and rates so intra-state orders show CGST and SGST and inter-state orders show IGST." },
    { verb: "Invoice", detail: "Set up GST invoices showing your GSTIN, HSN or SAC codes, tax breakup and the buyer's GSTIN for B2B orders." },
    { verb: "Test", detail: "Place test orders from your own state and another state, through each payment method, and check totals and invoices." },
  ],
  deliverables: [
    "Payment gateway connected in live mode with webhooks verified",
    "WooCommerce tax classes and rates set per your accountant's instructions",
    "CGST and SGST or IGST applied by the customer's state",
    "GST invoice template with GSTIN, HSN or SAC codes and tax breakup",
    "An optional GSTIN field at checkout for business buyers",
    "Test order records showing totals and invoices for each case",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Which Indian payment gateway should I use?", a: "Razorpay, PayU, Cashfree, PhonePe and CCAvenue all have WooCommerce plugins and support UPI, cards and netbanking. The right one depends on their fees, settlement terms and approval for your business, which you agree with the provider directly." },
    { q: "How does WooCommerce decide between CGST plus SGST and IGST?", a: "We set rates by state. When the place of supply is in the same state as your GST registration, CGST and SGST apply. When it is another state, IGST applies. WooCommerce uses the billing or shipping state, as configured." },
    { q: "What GST rate should I charge?", a: "That is a question for your accountant or CA. We do not give tax advice. Once they confirm the rate and HSN or SAC code for each product, we configure the store to match." },
    { q: "Does WooCommerce create GST invoices by itself?", a: "No. WooCommerce calculates tax, but GST-compliant invoices with your GSTIN, HSN codes and tax breakup need an invoice plugin or custom template, which we set up." },
    { q: "Can business customers enter their GSTIN?", a: "Yes. We add an optional GSTIN field at checkout and show it on the invoice so the buyer can claim input tax credit." },
    { q: "Do you need my gateway login?", a: "Most gateways let you create API keys and webhook secrets to share with us, so your main login stays private." },
  ],
  guideSlugs: [],
  relatedPaths: ["/woocommerce/fixes/", "/woocommerce/development/", "/wordpress-maintenance/woocommerce/"],
  seo: {
    title: "Razorpay, PayU and GST Setup for WooCommerce",
    description: "Set up Razorpay, PayU, Cashfree, PhonePe or CCAvenue on WooCommerce, with CGST, SGST and IGST by state and GST invoices showing your GSTIN.",
  },
  image: { slot: "service-payment-gateway-gst", photo: "store", alt: "WooCommerce tax settings screen with CGST, SGST and IGST rates entered by state" },
});
