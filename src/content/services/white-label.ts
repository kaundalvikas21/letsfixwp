import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "white-label",
  path: "/wordpress-maintenance/white-label/",
  hub: "wordpress-maintenance",
  intent: "project",
  title: "White label WordPress support for agencies",
  h1: "White-label WordPress support your agency can put its own name on",
  summary:
    "We do the WordPress maintenance, fixes and development behind the scenes, and your agency stays the only name your clients see.",
  whoItsFor:
    "Design, marketing and web agencies that build on WordPress and need dependable technical help without hiring in-house developers.",
  symptoms: [],
  whatWeDo: [
    { verb: "Onboard", detail: "Take a full inventory of each client site, including hosting, plugins, licences and access, and agree how work requests reach us." },
    { verb: "Maintain", detail: "Run updates, backups and monitoring across your client sites under your agency's process." },
    { verb: "Fix", detail: "Handle broken sites, errors and hacks that your clients report to you, working through your ticket or chat channel." },
    { verb: "Build", detail: "Take on development tasks such as new pages, theme changes and plugin work to your agency's standards." },
    { verb: "Report", detail: "Write unbranded reports that you can send to clients under your own name or merge into your own reporting." },
  ],
  deliverables: [
    "Unbranded maintenance and work reports ready for your logo",
    "A signed NDA and an agreement that we never contact your clients directly",
    "A site inventory for each client covering hosting, plugins and access",
    "Work notes and change logs for every task, kept in your system or ours",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Will my clients ever know you are involved?", a: "No, unless you choose to tell them. We sign an NDA, do not put our name in reports or code comments and do not contact your clients." },
    { q: "Can you work inside our project management tools?", a: "Yes. We can take tickets in your help desk, project board or shared Slack channel, so your team sees work in the place it already works." },
    { q: "Do you need access to our client sites?", a: "Yes, with an account in WordPress and access to hosting or SFTP. We recommend separate named accounts for us so access can be removed cleanly at any time." },
    { q: "How is white-label work priced?", a: "It depends on the number of sites and the mix of maintenance, fixes and development. We quote after reviewing your client list and the work you expect to pass on." },
    { q: "Can you handle only emergencies and leave routine work to us?", a: "Yes. Some agencies use us only for urgent fixes or hard technical work, and keep updates and content in-house." },
  ],
  guideSlugs: [],
  relatedPaths: ["/wordpress-maintenance/care-plans/", "/wordpress-maintenance/support-hours/", "/wordpress-development/hire-developer/"],
  seo: {
    title: "White Label WordPress Support for Agencies",
    description: "White-label WordPress maintenance, fixes and development for agencies, with an NDA, unbranded reports and no contact with your clients.",
  },
  image: { slot: "service-white-label", alt: "Agency project board with WordPress support tickets assigned and in progress" },
});
