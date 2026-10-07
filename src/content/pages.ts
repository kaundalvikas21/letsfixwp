// Copy for page templates and standalone pages (P1). Templates hold only short UI headings; every sentence lives here.
// Text that makes a promise the owner has not confirmed carries {{CONFIRM}} and is listed in brand.ts claims.

export const pageCopy = {
  guide: {
    /** {title} is replaced with the guide's error phrase, so the sentence differs on every guide. */
    coreWarning: "Do not edit WordPress core files to clear “{title}”. Core edits are overwritten by the next update and can hide the real cause.",
  },
  cityHub: {
    h1: "WordPress development by city",
    band: "Pick your city, or tell us about the project directly.",
  },
  freeCheck: {
    h1: "Free WordPress site check",
    intro: "For sites that work today but worry you. Send the address and an engineer looks it over.",
    covers: [
      { title: "Updates", detail: "WordPress core, plugin and theme versions, and any plugin with a published vulnerability." },
      { title: "Backups", detail: "Whether backups run, where they are stored and when the last one finished." },
      { title: "Security basics", detail: "Admin accounts, file permissions and how logins are protected." },
      { title: "Speed", detail: "Core Web Vitals and the slowest pages on the site." },
    ],
    success: {
      title: "Your check request is ready",
      body: "A short written report on updates, backups, security basics and speed comes back to you by email.",
    },
  },
  caseStudies: {
    h1: "Case studies",
    empty: "No case studies are published yet. Each one goes up once the client approves the write-up.",
    chat: "Have a problem like the ones we fix? Describe it to an engineer.",
  },
  pricing: {
    h1: "Pricing",
    intro: "Starting prices for every service. Where a price is not published yet, ask for a quote.",
    band: "Not sure which service fits? An engineer can point you to the right one.",
  },
  about: {
    paragraphs: [
      "We fix WordPress sites that are down, hacked or slow, then keep them maintained on care plans.",
      "We also build WordPress and WooCommerce sites for businesses across India, working remotely.",
    ],
    band: "Tell us what you need, broken site or new build.",
  },
} as const;
