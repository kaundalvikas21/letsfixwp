import type { Intent } from "./sitemap";

// Every CTA label on the site, one per intent. No other CTA wording may exist in the codebase.
// Targets come from routes.ts: BOOK = routes.book, PLANS = routes.plans, QUOTE = routes.quote, CHECK = routes.check.
export const CTA = {
  BOOK: "Fix my site",
  CHAT: "Chat with an engineer",
  PLANS: "See plans",
  QUOTE: "Get a quote",
  CHECK: "Get a free site check",
} as const;

export type CtaIntent = "BOOK" | "PLANS" | "QUOTE";

/**
 * The closing band's heading, by the page's primary intent.
 *
 * A question put to the reader, never a label. The service and guide templates were passing the
 * service's own title into that slot, so 69 pages ended on a band that read "WordPress 500, 502 and
 * 503 error fix" beside two buttons: a product name sitting next to a control, asking nothing. Every
 * other closing band on the site asks something ("Want a price for your site?", "Cannot see your
 * error here?"), and that is what makes the block read as the offer rather than as a caption.
 *
 * Here rather than in the templates because it is CTA wording, which this file owns, and because
 * one question per intent is the whole set: a page's intent already decides its primary button, so
 * it can decide the sentence above it too.
 */
export const CLOSING_ASK = {
  BOOK: "Want this fixed on your site?",
  PLANS: "Want us to look after your site?",
  QUOTE: "Want a quote for this?",
} as const satisfies Record<CtaIntent, string>;

/** A page's primary CTA follows its SITEMAP node intent. CHAT is always the secondary. */
export const primaryCtaFor = (intent: Intent | undefined): CtaIntent =>
  intent === "plan" ? "PLANS" : intent === "project" ? "QUOTE" : "BOOK";
