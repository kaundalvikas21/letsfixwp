import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "hire-developer",
  path: "/wordpress-development/hire-developer/",
  hub: "wordpress-development",
  intent: "project",
  title: "Hire a WordPress developer",
  h1: "Hire a dedicated WordPress developer",
  summary:
    "A WordPress developer who works on your projects as part of your team, part time or full time, using your tools and your process.",
  whoItsFor:
    "Businesses and agencies with a steady flow of WordPress work who want a dedicated developer without the cost and delay of hiring one.",
  symptoms: [],
  whatWeDo: [
    { verb: "Match", detail: "Understand your stack, projects and working hours, and assign a developer who fits that work." },
    { verb: "Onboard", detail: "Set up access to your repositories, staging sites and tools, and agree how tasks are assigned." },
    { verb: "Build", detail: "Work through your backlog of themes, plugins, WooCommerce features, fixes and updates." },
    { verb: "Review", detail: "Submit work through pull requests or your review process, with notes on what changed." },
    { verb: "Report", detail: "Share regular progress updates and time records so you can see what was done." },
  ],
  deliverables: [
    "A named WordPress developer working on your tasks",
    "Work committed to your repositories under your process",
    "Regular progress updates and timesheets",
    "An NDA and full ownership of all code written for you",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "Part time or full time?", a: "Either. Some clients book a set number of hours a week, others need a developer full time. We agree the arrangement in the quote." },
    { q: "Can the developer join our stand-ups and Slack?", a: "Yes. The developer works in your Slack, Teams, Jira or Trello, and joins your calls during agreed working hours." },
    { q: "Who owns the code?", a: "You do. All work is committed to your repositories, and an NDA and ownership terms are signed at the start." },
    { q: "What if the developer is not the right fit?", a: "Tell us and we will discuss a change of developer, with a handover so work in progress is not lost." },
    { q: "What does it cost to hire a WordPress developer?", a: "It depends on the hours per week and the type of work. We send a quote once we understand your workload." },
  ],
  guideSlugs: [],
  relatedPaths: ["/wordpress-development/custom-plugin/", "/wordpress-maintenance/white-label/", "/wordpress-maintenance/support-hours/"],
  seo: {
    title: "Hire a Dedicated WordPress Developer",
    description: "Hire a dedicated WordPress developer, part time or full time, working in your tools and repositories, with an NDA and full code ownership.",
  },
  image: { slot: "service-hire-developer", alt: "Developer reviewing a pull request for a WordPress theme on a laptop" },
});
