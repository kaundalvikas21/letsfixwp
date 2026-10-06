import { serviceSchema } from "../schema";

export default serviceSchema.parse({
  id: "support-hours",
  path: "/wordpress-maintenance/support-hours/",
  hub: "wordpress-maintenance",
  intent: "plan",
  title: "Pay as you go WordPress support",
  h1: "Pay-as-you-go WordPress support hours",
  summary:
    "Buy a block of developer hours and use them for whatever your WordPress site needs, from small fixes to content changes, without a monthly contract.",
  whoItsFor:
    "Site owners who need WordPress help now and then, not every month, and prefer to pay only for the time actually used.",
  symptoms: [],
  whatWeDo: [
    { verb: "Scope", detail: "Read your request, ask what we need and tell you roughly how many hours it should take before we start." },
    { verb: "Back up", detail: "Take a backup of files and database before any change, so the work can be undone if needed." },
    { verb: "Fix", detail: "Carry out the fix, change or small build you asked for and check the affected pages afterwards." },
    { verb: "Log", detail: "Record the time spent on each task so you can see exactly where your hours went." },
  ],
  deliverables: [
    "A block of hours you can use for any WordPress task",
    "An estimate before each task starts",
    "A time log listing each task and the hours used",
    "A short note of what was changed for every task",
  ],
  typicalTurnaround: null,
  priceFrom: null,
  faqs: [
    { q: "What can I use support hours for?", a: "Anything WordPress related: fixing errors, plugin and theme changes, small design tweaks, content updates, form setup and WooCommerce changes." },
    { q: "How do I know how many hours a task will use?", a: "We estimate before starting and tell you if the work turns out bigger than expected, so hours are not used up without your agreement." },
    { q: "Do unused hours expire?", a: "The pricing page lists the current hour blocks and how long each stays valid." },
    { q: "Should I choose hours or a care plan?", a: "Hours suit sites that need help occasionally. If you need regular updates, backups and monitoring, a care plan usually covers that better. Our comparison page sets out both." },
  ],
  guideSlugs: [],
  relatedPaths: ["/compare/care-plan-vs-pay-as-you-go-support/", "/wordpress-maintenance/care-plans/", "/pricing/"],
  seo: {
    title: "Pay As You Go WordPress Support Hours",
    description: "Buy WordPress developer hours and use them for fixes, changes and small builds. Estimates before each task and a log of every hour used.",
  },
  image: { slot: "service-support-hours", alt: "Time log listing WordPress support tasks with hours used against each one" },
});
