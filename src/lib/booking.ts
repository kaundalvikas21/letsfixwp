import { brand } from "@/config/brand";

/**
 * Booking handoff adapter. After a ticket is accepted, the chosen provider takes over payment or scheduling.
 * brand.bookingProvider picks one ({{CONFIRM}} until the owner decides); each adapter is inert until its
 * environment keys exist, so the flow never sends a visitor to a half-configured checkout.
 */
export type HandoffInput = { ticketId: string; service: string; name: string; email: string; phone: string };
export type Handoff = { kind: "redirect"; url: string; label: string } | { kind: "none" };

type Adapter = { label: string; ready: () => boolean; start: (b: HandoffInput) => Promise<Handoff> };

const adapters: Record<NonNullable<typeof brand.bookingProvider>, Adapter> = {
  razorpay: {
    // UPI, cards and netbanking, GST invoices. Payment Links API: POST https://api.razorpay.com/v1/payment_links
    label: "Pay with UPI, card or netbanking",
    ready: () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    start: async () => {
      // ponytail: amount comes from the agreed quote, which does not exist at ticket time. Create the payment
      // link when the quote is accepted; until then there is nothing to charge.
      return { kind: "none" };
    },
  },
  stripe: {
    // Stripe Checkout: POST https://api.stripe.com/v1/checkout/sessions
    label: "Pay by card",
    ready: () => !!process.env.STRIPE_SECRET_KEY,
    start: async () => ({ kind: "none" }), // ponytail: same as Razorpay, a session needs the quoted amount.
  },
  calcom: {
    // Cal.com booking page with prefilled name and email.
    label: "Pick a time for the call",
    ready: () => !!process.env.CALCOM_BOOKING_URL,
    start: async (b) => {
      const url = new URL(process.env.CALCOM_BOOKING_URL!);
      url.searchParams.set("name", b.name);
      url.searchParams.set("email", b.email);
      url.searchParams.set("notes", `Ticket ${b.ticketId}: ${b.service || "Something else"}`);
      return { kind: "redirect", url: url.toString(), label: "Pick a time for the call" };
    },
  },
};

const active = () => (brand.bookingProvider ? adapters[brand.bookingProvider] : null);

/** What the Confirm screen says will happen next. */
export const handoffLabel = () => {
  const a = active();
  return a && a.ready() ? a.label : null;
};

export async function startHandoff(b: HandoffInput): Promise<Handoff> {
  const a = active();
  return a && a.ready() ? a.start(b) : { kind: "none" };
}

/** Confirmation email stub. ponytail: no email provider yet; returns sent: false so the UI offers the mailto fallback. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the provider call will use it
export async function sendConfirmationEmail(_b: HandoffInput & { summary: string }): Promise<{ sent: boolean }> {
  return { sent: false };
}

/**
 * Double-submit guard. ponytail: in-memory per server instance; move to the CRM or a KV store when tickets are
 * persisted, since serverless instances do not share memory.
 */
const seen = new Map<string, string>();
export const ticketIdFor = (requestId: string) => {
  const existing = seen.get(requestId);
  if (existing) return { ticketId: existing, duplicate: true };
  const ticketId = `T-${Date.now().toString(36).toUpperCase()}`;
  seen.set(requestId, ticketId);
  if (seen.size > 5000) seen.delete(seen.keys().next().value!);
  return { ticketId, duplicate: false };
};
