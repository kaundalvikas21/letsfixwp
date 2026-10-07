import { citySchema } from "../schema";

export default citySchema.parse({
  slug: "bengaluru",
  city: "Bengaluru",
  priority: 3,
  localContext: [
    "Bengaluru is widely seen as the centre of India's startup and SaaS scene, and most companies here already have engineers. What they rarely have is engineering time to spare for the marketing site. A common setup is a product on its own stack with WordPress running the website, blog, careers page and changelog, so marketing can ship pages without a pull request against the main codebase.",
    "For SaaS teams the WordPress work is specific: a custom block theme that follows the product's design system, pricing and comparison pages, connections to HubSpot or another CRM, and Core Web Vitals that hold up because the site sits at the top of a paid acquisition funnel. Teams scaling their content often prefer a dedicated developer who joins their Slack and works through a backlog.",
    "The city also has a large number of consumer brands, restaurants, clinics and local service businesses selling to people who live here. Some want Kannada content for part of their audience, which we handle with a multilingual setup rather than a second copy of the site.",
    "We work with Bengaluru teams remotely. Reviews happen on video call, and we can work inside the tools you already use, such as Git, Jira, Linear or Slack.",
  ],
  remoteDelivery:
    "We work on IST like you, so standups, sprint reviews and design calls on video happen inside your normal hours rather than late at night. Handover fits how engineering teams already work: credentials shared through your password manager, documentation in your repository or wiki, and a recorded walkthrough of the theme and block setup for the marketing team.",
  servicesHighlighted: ["custom-theme", "hire-developer", "speed-optimization", "custom-plugin"],
  faqs: [
    {
      q: "Can you build a block theme that matches our product's design system?",
      a: "Yes. We turn your colours, type scale and components into a custom block theme with theme.json and custom blocks, so the marketing team builds pages from approved parts instead of free-form layouts.",
    },
    {
      q: "Can we hire a developer who works from our backlog?",
      a: "Yes. A dedicated developer takes tickets from your tracker, raises pull requests for review and joins your planning calls on video.",
    },
    {
      q: "Our marketing site is slow and paid traffic is bouncing. Can you help?",
      a: "Yes. We measure the pages that receive paid traffic, find what is slowing them down, such as heavy scripts, unoptimised images or uncached queries, and fix those causes.",
    },
    {
      q: "Can WordPress pass form leads to our CRM?",
      a: "Usually yes. HubSpot, Salesforce, Zoho and most analytics tools have official plugins or APIs. Where they do not fit, we write a small custom plugin to send the data across.",
    },
    {
      q: "Can you add Kannada pages to our site?",
      a: "Yes. We add Kannada as a separate language with its own URLs and menus, and check that the text renders correctly across browsers and phones.",
    },
  ],
  seo: {
    title: "WordPress Development in Bengaluru",
    description: "WordPress for Bengaluru startups and SaaS teams: custom block themes, dedicated developers, CRM connections and fast marketing sites. Remote work.",
  },
});
