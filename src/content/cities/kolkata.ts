import { citySchema } from "../schema";

export default citySchema.parse({
  slug: "kolkata",
  city: "Kolkata",
  priority: 5,
  localContext: [
    "Kolkata has long been a commercial centre of the tea trade, with auction activity, brokers and the head offices of many gardens and blenders based in the city. Tea companies use their websites to describe their estates and grades for trade buyers, and some now sell packaged tea directly to consumers. That calls for an estate and grade catalogue on the same site as a WooCommerce shop with Indian payment gateways.",
    "Jute mills and jute product makers along the Hooghly sell sacking to bulk buyers and also make bags and home goods for export. Their websites need product specifications, packing options and enquiry forms for bulk orders, rather than a shopping cart.",
    "The city is also a distribution base for eastern India and the North East, with many FMCG distributors, stockists and C&F agents. For them a site is mostly about credibility and coverage: the brands they carry, the areas they serve and an easy way for retailers to get in touch. Schools, colleges and coaching centres, another large group, need admission pages, notice boards and fee information that office staff can update themselves.",
    "A good share of the audience for schools, local brands and retail tea reads Bengali, so we often build Bengali pages alongside English ones and check that Bengali script displays correctly. We work with Kolkata businesses remotely, with every meeting on video call.",
  ],
  servicesHighlighted: ["website-design", "woocommerce-development", "redesign", "seo-services"],
  faqs: [
    {
      q: "Can you build a Bengali version of our website?",
      a: "Yes. Bengali becomes a separate language version with its own URLs and menus, so it can be found in search, and we test the script on common phones and browsers.",
    },
    {
      q: "We sell tea to trade buyers and to consumers. Can one site do both?",
      a: "Yes. Retail packs sell through a WooCommerce shop, while a separate section lists grades for trade buyers with an enquiry form instead of a cart.",
    },
    {
      q: "Our school website is old and hard to update. Can you redesign it?",
      a: "Yes. We move the existing content into a new WordPress theme, add a notices section and admission pages your staff can edit, and redirect old URLs so saved links and search listings keep working.",
    },
    {
      q: "Do you have a team in Kolkata?",
      a: "No. We have no office or staff in Kolkata and work remotely. Calls happen on video, and you can review progress on a staging site at any time.",
    },
  ],
  seo: {
    title: "WordPress Development in Kolkata",
    description: "WordPress sites for Kolkata tea, jute, FMCG distribution and education businesses, with WooCommerce, Bengali pages and redesigns. Built remotely.",
  },
});
