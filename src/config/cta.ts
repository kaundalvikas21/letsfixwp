import type { Intent } from "./sitemap";

// Every CTA label on the site, one per intent. No other CTA wording may exist in the codebase.
// Targets come from routes.ts: BOOK = routes.book, PLANS = routes.plans, QUOTE = routes.quote, CHECK = routes.check.
export const CTA = {
  BOOK: "Fix my site",
  CHAT: "Chat with an engineer",
  PLANS: "See plans",
  QUOTE: "Get a quote",
  CHECK: "Get a free site check",
  HOW: "See how we fix it", // V1 secondary text link to a service page
} as const;

export type CtaIntent = "BOOK" | "PLANS" | "QUOTE";

/** A page's primary CTA follows its SITEMAP node intent. CHAT is always the secondary. */
export const primaryCtaFor = (intent: Intent | undefined): CtaIntent =>
  intent === "plan" ? "PLANS" : intent === "project" ? "QUOTE" : "BOOK";
