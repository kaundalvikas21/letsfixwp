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
  chat: {
    fallbackTitle: "Chat is not available right now",
    fallbackBody: "Email us, or open an emergency ticket and an engineer picks it up.",
  },
  booking: {
    h1: "Contact and emergency ticket",
    tabs: { ticket: "Emergency ticket", project: "Project enquiry" },
    screens: { problem: "Problem", site: "Your site", contact: "Contact", confirm: "Confirm" },
    problem: {
      searchLabel: "What is wrong?",
      searchHelp: "Type what you see, like a message on the screen, then pick the closest match.",
      common: "Common problems",
      noMatch: "No close match. Choose Something else and describe it in your own words.",
      other: "Something else",
      otherLabel: "Describe what you see",
      otherHelp: "Include any error message exactly as it appears, and when it started.",
      prefilled: "You came here from this page, so it is already selected.",
      change: "Choose a different problem",
    },
    site: {
      urlHelp: "The address visitors type, like example.com.",
      hostLabel: "Who hosts the site? (optional)",
      hostHelp: "For example Hostinger, GoDaddy or a cloud server. Leave it blank if you are not sure.",
      accessLabel: "How should we get access?",
      accessHelp: "Never type a password into this form. We arrange access separately.",
      access: [
        { value: "secure-link", label: "Send me a secure link after booking", help: "You share access through a one-time link we send you." },
        { value: "temp-admin", label: "I will create a temporary admin account", help: "We send step-by-step instructions, and you delete the account when we finish." },
        { value: "on-call", label: "Let us sort it out on a call", help: "An engineer walks you through it." },
      ],
    },
    contact: {
      nameHelp: "So the engineer knows who to ask for.",
      emailHelp: "Updates and the fix report go here.",
      phoneLabel: "Phone (optional)",
      phoneHelp: "Only used if you choose a call or WhatsApp below.",
      methodLabel: "How should we reach you?",
      methods: [
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone call" },
        { value: "whatsapp", label: "WhatsApp" },
      ],
    },
    confirm: {
      quote: "Quote before work begins",
      priceLabel: "Price",
      nextLabel: "Next step",
    },
    errors: {
      summary: "Some details need attention.",
      server: "We could not send the ticket. Your details are still here; try again, or chat with an engineer.",
      duplicate: "This ticket was already sent.",
    },
    success: {
      title: "Ticket received",
      next: [
        "An engineer reads your ticket and the problem you picked.",
        "You get a reply with the next step and how to share access safely.",
        "Work starts only after you agree the quote.",
      ],
      emailSent: "A confirmation is on its way to {email}.",
      emailFallback: "Email delivery is not set up yet, so send this ticket to us from your email app:",
    },
    project: {
      intro: "Planning a new site, a redesign, a migration or ongoing care? Tell us the shape of it.",
      serviceLabel: "What do you need?",
      budgetLabel: "Budget range",
      budgetHelp: "A rough range is enough to suggest the right approach.",
      budgets: ["Under \u20b950,000", "\u20b950,000 to \u20b92,00,000", "\u20b92,00,000 to \u20b95,00,000", "Over \u20b95,00,000", "Not sure yet"],
      timelineLabel: "Timeline",
      timelines: ["As soon as possible", "Within a month", "In one to three months", "Flexible"],
      detailsLabel: "Anything else we should know? (optional)",
      successTitle: "Enquiry received",
      successBody: "An engineer reads it and replies with questions or a proposal.",
    },
  },
} as const;
