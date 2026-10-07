import { citySchema } from "../schema";

export default citySchema.parse({
  slug: "hyderabad",
  city: "Hyderabad",
  priority: 8,
  localContext: [
    "Hyderabad is one of India's main centres for pharmaceuticals and life sciences, with bulk drug and API manufacturers, formulation companies, contract research and manufacturing organisations, and biotech firms in Genome Valley and the city's industrial areas. Their websites serve regulators, auditors, global partners and job seekers at once, so they need product and API lists, facility and quality pages, regulatory approval details and document downloads, all kept accurate as the portfolio changes.",
    "For these companies we usually build a custom theme with structured product records, organised by molecule, therapeutic area or dosage form, plus filters and search so a buyer can find a specific API without browsing every page. Some also need a password-protected area where partners download technical documents.",
    "The city's large IT services and global capability centre presence means many technology companies with their own marketing teams. They often want a developer who can work through a steady flow of landing pages, integrations and fixes, plus a care arrangement that keeps the site updated and backed up between projects.",
    "Telugu pages make sense for schools, hospitals, real estate projects and consumer brands selling within Telangana and Andhra Pradesh. We work with Hyderabad businesses remotely and hold all meetings on video call.",
  ],
  remoteDelivery:
    "Hyderabad shares IST with us, so meetings run on video during your working hours and can include your QA or regulatory staff when product pages need their sign-off. Handover covers credentials for the site, hosting and any partner download area, a written guide to adding or updating product records, and a recorded screen walkthrough your marketing team can keep for reference.",
  servicesHighlighted: ["custom-theme", "custom-plugin", "hire-developer", "care-plans"],
  faqs: [
    {
      q: "Can buyers search our product list by API name or CAS number?",
      a: "Yes. We store each product as a structured record with fields such as API name, CAS number, therapeutic area and dosage form, then add search and filters on those fields.",
    },
    {
      q: "Can partners get a private area for technical documents?",
      a: "Yes. We build a login area where approved partners download documents, and your team controls who has access and which files each partner can see.",
    },
    {
      q: "Can you build Telugu pages alongside English?",
      a: "Yes. Telugu becomes its own language version with separate URLs and menus, and we test Telugu script rendering on phones and common browsers.",
    },
    {
      q: "Can you work alongside our in-house IT team?",
      a: "Yes. We can work in your repository, follow your review process and coordinate with your IT team on hosting and access. Planning and reviews happen on video call.",
    },
  ],
  seo: {
    title: "WordPress Development in Hyderabad",
    description: "WordPress for Hyderabad pharma, life sciences and IT companies: searchable product lists, partner portals, Telugu pages and dedicated developers.",
  },
});
