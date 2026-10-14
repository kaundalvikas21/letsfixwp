import { brand } from "@/config/brand";
import type { Booking } from "@/app/contact/booking-schema";

/**
 * What happens after a ticket is confirmed. One adapter so a provider can be plugged in without touching the
 * form: set brand.bookingProvider and fill in that provider's branch.
 *
 * Until a provider is chosen the handoff is "email": the visitor's own mail app opens with the ticket prepared,
 * so no request is silently dropped. Nothing here charges a card or books a slot on its own.
 */
export type Handoff =
  | { kind: "email" | "payment" | "schedule"; label: string; href: string; note: string }
  /** No support address is confirmed yet, so there is nothing honest to link to: show the ticket to copy. */
  | { kind: "copy"; label: string; text: string; note: string };

const line = (k: string, v: string | undefined) => (v ? `${k}: ${v}\n` : "");

/** The ticket as plain text, used by the email handoff and by the confirmation stub. */
export function bookingText(b: Booking, serviceTitle: string): string {
  const kind = b.type === "project" ? "Project enquiry" : b.type === "check" ? "Free site check" : "Emergency ticket";
  return (
    `${kind}\n\n` +
    line("Service", serviceTitle || (b.type === "fix" ? "Not sure yet" : undefined)) +
    line("Guide", b.guide) +
    line("Site", b.siteUrl) +
    line("Host", b.host) +
    line("Access", b.access) +
    line("Budget", b.budget) +
    line("Timeline", b.timeline) +
    line("Name", b.name) +
    line("Email", b.email) +
    line("Phone", b.phone) +
    line("Preferred contact", b.contactMethod) +
    (b.description ? `\n${b.description}\n` : "")
  );
}

export function getHandoff(b: Booking, serviceTitle: string): Handoff {
  const subject = b.type === "project" ? "Project enquiry" : b.type === "check" ? "Free site check" : `Emergency ticket: ${serviceTitle || b.siteUrl}`;

  switch (brand.bookingProvider) {
    // Each branch returns the provider's own URL for this ticket. Amount and currency come from the service's
    // published price, so none of these can run until prices exist (src/content/pricing.ts).
    case "razorpay":
    case "stripe":
      throw new Error(`booking: brand.bookingProvider is "${brand.bookingProvider}" but no checkout session is created yet`);
    case "cal":
      throw new Error('booking: brand.bookingProvider is "cal" but no Cal.com link is configured yet');
    default:
      if (brand.email.includes("{{"))
        return {
          kind: "copy",
          label: "Copy the ticket",
          text: bookingText(b, serviceTitle),
          note: "Copy this and send it to us. A support address goes here once the owner confirms one.",
        };
      return {
        kind: "email",
        label: "Send the ticket",
        href: `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bookingText(b, serviceTitle))}`,
        note: "This opens your email app with the ticket filled in. Send it and an engineer picks it up.",
      };
  }
}
