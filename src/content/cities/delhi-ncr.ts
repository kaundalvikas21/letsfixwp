import { citySchema } from "../schema";

export default citySchema.parse({
  slug: "delhi-ncr",
  city: "Delhi NCR",
  priority: 2,
  localContext: [
    "Real estate is one of the most visible website categories across Gurugram, Noida and Greater Noida. Developers and channel partners need project pages with floor plans, location maps, RERA registration details and lead forms that feed a CRM or a sales inbox. Because every new launch needs its own page, we build these sites so the marketing team can create a project page from a template instead of commissioning a new microsite each time.",
    "The region also has a dense education sector: coaching institutes for entrance and competitive exams, K-12 schools and private universities. Their sites carry course listings, batch schedules, admission forms, results and a steady stream of notices. A large part of their audience reads in Hindi, so we often build Hindi versions of course and admission pages next to the English ones, with each language indexed separately.",
    "Export houses in Noida, Okhla and the wider NCR, dealing in garments, home textiles and handicrafts, use their websites as a catalogue for overseas buyers. They need product ranges, compliance and certification pages, and a way to request quotes without publishing prices.",
    "Professional firms such as chartered accountants, law practices and consultancies want something quieter: clear service pages, partner profiles, articles and an easy way to book a consultation. We are not based in Delhi NCR; we work remotely, with reviews and walkthroughs on video call.",
  ],
  servicesHighlighted: ["website-design", "custom-theme", "seo-services", "redesign"],
  faqs: [
    {
      q: "Can each real estate project page show its RERA details?",
      a: "Yes. We add fields for the RERA registration number and related details to the project template, so they display the same way on every project and cannot be skipped by accident when a new launch is published.",
    },
    {
      q: "Can our institute's website have Hindi and English versions?",
      a: "Yes. We set up Hindi and English as separate language versions with their own URLs, so both can appear in search. Notices and course pages can be published in one language or both.",
    },
    {
      q: "We are an export house. Can buyers ask for a quote on specific products?",
      a: "Yes. We add a quote list where buyers pick products, enter quantities and send a single enquiry to your team, with no prices shown on the site.",
    },
    {
      q: "How do meetings work if you are not in Delhi?",
      a: "Every meeting happens on video call, from the first discovery session to the final handover. Between calls you can follow progress on a staging copy of the site.",
    },
  ],
  seo: {
    title: "WordPress Development in Delhi NCR",
    description: "WordPress sites for Delhi NCR real estate, coaching institutes, export houses and professional firms, with Hindi pages and SEO. Built remotely.",
  },
});
