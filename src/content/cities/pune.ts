import { citySchema } from "../schema";

export default citySchema.parse({
  slug: "pune",
  city: "Pune",
  priority: 6,
  localContext: [
    "Pune's standing as an education city shows in its websites. Universities, autonomous colleges, schools, coaching classes and skill training institutes all need course catalogues, admission enquiry forms, faculty pages, event and notice sections, and pages for accreditations and approvals. These sites are edited by people across many departments, so we set up clear editing roles and page templates that keep the design consistent no matter who publishes.",
    "The industrial belt around Chakan, Pimpri-Chinchwad, Ranjangaon and Talegaon is full of auto component makers and engineering firms supplying vehicle manufacturers in India and abroad. Their buyers look for capabilities, certifications, plant details and product ranges, and expect to send a drawing or RFQ through the website. We build capability-led sites with enquiry forms that accept file uploads and route them to sales.",
    "Pune also has a large IT services and product engineering sector. Mid-sized IT firms usually need a site that presents service lines and industry pages, shows project material they already have permission to publish, and runs a careers section connected to their hiring tools.",
    "Marathi pages are useful for schools, local institutes and consumer businesses with a local audience. After launch, many institutions prefer a monthly care plan so updates, backups and security checks do not depend on one staff member. All our work with Pune clients is remote, with meetings on video call.",
  ],
  remoteDelivery:
    "Sharing IST means video meetings can sit inside your college timetable or your plant's working hours. Because people across many departments edit these sites, handover includes a separate login for each role, a written guide for each page template, and a recorded walkthrough that new staff can watch when they join.",
  servicesHighlighted: ["website-design", "custom-plugin", "care-plans", "seo-services"],
  faqs: [
    {
      q: "Can you add Marathi pages to our institute's website?",
      a: "Yes. We add Marathi as its own language version with separate URLs and menus, and check Devanagari rendering on phones. Notices can go out in Marathi, English or both.",
    },
    {
      q: "Can admission enquiries go to different departments?",
      a: "Yes. The enquiry form asks which course or campus the student is interested in and sends the lead to that department's inbox or your CRM.",
    },
    {
      q: "Can buyers upload drawings or RFQs through the website?",
      a: "Yes. We add an RFQ form that accepts PDFs and common drawing formats, limits file types and sizes, and sends each submission to your sales team.",
    },
    {
      q: "Who looks after the site after launch?",
      a: "Your team can edit content using the roles and templates we set up. If you would rather not handle WordPress updates, backups and security checks yourselves, a monthly care plan covers them.",
    },
  ],
  seo: {
    title: "WordPress Development in Pune",
    description: "WordPress sites for Pune colleges, institutes, auto component makers and IT firms: admissions, RFQ forms, Marathi pages and ongoing care.",
  },
});
