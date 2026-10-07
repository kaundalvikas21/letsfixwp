import { citySchema } from "../schema";

export default citySchema.parse({
  slug: "chennai",
  city: "Chennai",
  priority: 1,
  localContext: [
    "Chennai's industrial belt along Sriperumbudur, Oragadam and Ambattur is home to a large base of automotive and engineering suppliers, from component makers to tool rooms and precision machining shops. Their websites are read mostly by purchase teams at vehicle makers and by overseas buyers, so what matters is a clear capability page, machine lists, certifications, downloadable product sheets and an enquiry form that reaches the right person. We build WordPress sites around those pieces, with a product and capability catalogue the internal team can update without calling a developer.",
    "Healthcare is the other big website category in the city: multi-speciality hospitals, diagnostic chains, dental and eye clinics, and the many providers who treat patients travelling in from other states and abroad. These sites need doctor profiles, department pages, appointment request forms and careful handling of any patient details. Many also need Tamil versions of key pages so local patients can read about treatments and visiting hours in their own language, which we set up with a proper multilingual plugin so each language gets its own URL and search listing.",
    "Chennai also has a mature SaaS and IT services scene. Product companies here often run their app on a separate stack and use WordPress for the marketing site, blog and documentation. For them the work is a fast custom theme the marketing team can publish to on its own, clean connections to their CRM and analytics, and technical SEO that keeps the blog and landing pages indexable.",
    "We work with Chennai businesses remotely. Discovery calls, design reviews and handover sessions happen over video call, and everything else runs through shared documents and a staging site you can check at any point.",
  ],
  remoteDelivery:
    "Chennai runs on IST like the rest of India, so there is no time difference to plan around, and video calls are fixed around your plant shifts or clinic hours. When the site is ready we hand over every login and hosting credential, written notes on how the product catalogue and Tamil pages are organised, and a recorded walkthrough your marketing or purchase team can replay.",
  servicesHighlighted: ["website-design", "custom-plugin", "seo-services"],
  faqs: [
    {
      q: "Can you build a website in both English and Tamil?",
      a: "Yes. We use a multilingual plugin so English and Tamil pages each have their own URL, menu and SEO settings, and we check that Tamil text renders cleanly on phones. Your team supplies the Tamil copy, or we work with a translator you choose.",
    },
    {
      q: "Do you visit our office or plant in Chennai?",
      a: "No. We do not have an office in Chennai and work fully remotely, with meetings on video call. If the site needs photos of your plant or products, we share a shot list for your team or a local photographer to follow.",
    },
    {
      q: "We make components. Can buyers download data sheets from the site?",
      a: "Yes. We set up a product catalogue with specifications, drawings and PDF data sheets, and can place selected downloads behind a short enquiry form so your sales team knows who is interested.",
    },
    {
      q: "Can a hospital website take appointment requests?",
      a: "Yes. We build appointment request forms that route to the right department and collect only the details you need. For slot-based online booking, we connect the scheduling tool you already use.",
    },
  ],
  seo: {
    title: "WordPress Development in Chennai",
    description: "WordPress sites for Chennai manufacturers, hospitals and SaaS teams: product catalogues, Tamil and English pages, and SEO. Built remotely.",
  },
});
