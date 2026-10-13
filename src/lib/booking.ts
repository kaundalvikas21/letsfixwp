import { brand } from "@/config/brand";

/**
 * Handoff adapter for the Emergency Ticket.
 *
 * The flow ends in one of three ways depending on what the owner signs up for: take payment
 * (Razorpay for UPI, cards and netbanking with GST invoices), take payment (Stripe Checkout), or
 * book a slot (Cal.com). None is wired yet, so the default adapter hands the request to the
 * visitor's own email client and nothing is lost.
 *
 * To plug one in: implement HandoffAdapter, add it to ADAPTERS, and set
 * brand.promises.bookingProvider to its key. Nothing else in the flow changes.
 */
export type HandoffKind = "payment" | "scheduling" | "email";

export type HandoffRequest = {
  type: "fix" | "project" | "check";
  service: string;
  serviceTitle: string;
  guide: string;
  description: string;
  siteUrl: string;
  host: string;
  access: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  budget: string;
  timeline: string;
};

export type Handoff = {
  kind: HandoffKind;
  /** What the visitor is about to do, shown on the confirm screen before they commit. */
  label: string;
  /** Where the visitor goes next. A mailto: for the email adapter, a provider URL otherwise. */
  href: string;
};

export type HandoffAdapter = {
  kind: HandoffKind;
  label: string;
  build: (r: HandoffRequest) => string;
};

const SUBJECT: Record<HandoffRequest["type"], string> = {
  fix: "Fix request",
  project: "Project quote request",
  check: "Free site check request",
};

const lines = (r: HandoffRequest) =>
  [
    `Request: ${SUBJECT[r.type]}`,
    r.type !== "check" ? `Service: ${r.serviceTitle || "Not sure yet"}` : "",
    r.guide ? `Guide: ${r.guide}` : "",
    `Site: ${r.siteUrl}`,
    r.host ? `Host: ${r.host}` : "",
    `Access: ${r.access}`,
    r.budget ? `Budget: ${r.budget}` : "",
    r.timeline ? `Timeline: ${r.timeline}` : "",
    `Name: ${r.name}`,
    `Email: ${r.email}`,
    r.phone ? `Phone: ${r.phone}` : "",
    `Preferred contact: ${r.contactMethod}`,
    r.description ? `\n${r.description}` : "",
  ]
    .filter(Boolean)
    .join("\n");

/** Default until a provider is chosen. No account, no keys, nothing to configure. */
const emailAdapter: HandoffAdapter = {
  kind: "email",
  label: "Send this request to our engineers",
  build: (r) =>
    `mailto:${brand.email}?subject=${encodeURIComponent(`${SUBJECT[r.type]}: ${r.serviceTitle || r.siteUrl}`)}&body=${encodeURIComponent(lines(r))}`,
};

// Add "razorpay", "stripe" or "calcom" here when the owner has an account and keys.
const ADAPTERS: Record<string, HandoffAdapter> = { email: emailAdapter };

export function buildHandoff(r: HandoffRequest): Handoff {
  const key = brand.promises.bookingProvider ?? "email";
  const adapter = ADAPTERS[key] ?? emailAdapter;
  return { kind: adapter.kind, label: adapter.label, href: adapter.build(r) };
}
