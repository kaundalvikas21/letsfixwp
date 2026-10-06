import { compareSchema } from "../schema";

export default compareSchema.parse({
  slug: "care-plan-vs-pay-as-you-go-support",
  a: "Monthly care plan",
  b: "Pay-as-you-go support hours",
  rows: [
    {
      criterion: "How you pay",
      a: "A fixed monthly or annual fee for a defined scope of recurring work.",
      b: "You buy a block of hours and draw them down as tasks come up.",
    },
    {
      criterion: "Routine updates",
      a: "Core, plugin and theme updates are scheduled and handled as part of the plan, usually checked on a staging copy first.",
      b: "Updates happen when you ask for them, and the time comes out of your hours.",
    },
    {
      criterion: "Backups and monitoring",
      a: "Off-site backups, uptime checks and security scans run on a schedule in the background.",
      b: "Not included by default. You arrange your own, or spend hours having them set up.",
    },
    {
      criterion: "When something breaks",
      a: "The people fixing it already know the site and have recent backups and update history to work from.",
      b: "Work starts when you raise a request, and part of the first task may go into getting familiar with the site.",
    },
    {
      criterion: "Budget predictability",
      a: "The same cost every month, whether the month is quiet or busy within the plan's scope.",
      b: "Spending follows actual use. Quiet months cost nothing extra; busy months use up more hours.",
    },
    {
      criterion: "Small changes and content edits",
      a: "Depends on the plan. Many include a set allowance of small tasks, with larger work quoted separately.",
      b: "Any task can use hours, from text edits to plugin setup, as long as hours remain.",
    },
    {
      criterion: "Security responsibility",
      a: "The provider watches for vulnerable plugins and applies fixes as part of routine work.",
      b: "You need to notice issues yourself and ask for help.",
    },
    {
      criterion: "Commitment",
      a: "An ongoing subscription, cancellable according to the plan's terms.",
      b: "No ongoing commitment beyond the hours you buy.",
    },
  ],
  verdictByScenario: [
    {
      scenario: "A business site or store that brings in leads or orders every day",
      verdict: "A care plan fits better. Downtime and missed updates cost more than the monthly fee, and routine maintenance happens without anyone having to remember it.",
    },
    {
      scenario: "A small brochure site that rarely changes, with someone in-house checking it",
      verdict: "Pay-as-you-go hours are usually enough. You pay only when you need a change or a fix.",
    },
    {
      scenario: "Your host already handles updates and backups, and you need occasional development help",
      verdict: "Pay-as-you-go hours avoid paying twice for maintenance your host already covers.",
    },
    {
      scenario: "A WooCommerce store with many plugins and payment integrations",
      verdict: "A care plan is the safer choice. Plugin updates on stores need testing, and checkout problems are expensive to find late.",
    },
  ],
  seo: {
    title: "Care Plan vs Pay-As-You-Go WordPress Support",
    description: "Compare a monthly WordPress care plan with pay-as-you-go support hours: what each covers, how the costs work, and which suits your site.",
  },
});
